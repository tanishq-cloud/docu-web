"use client";

import { useState, useEffect } from "react";
import MessagesList from '@/components/chat/MessagesList';
import { collection, addDoc, onSnapshot, serverTimestamp, arrayUnion, updateDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase"; 
import { PlaceholdersAndVanishInput } from "@/components/ui/placeholders-and-vanish-input";
import ModelSelection from "@/components/chat/ModelSelector";
import FileSelection from "@/components/chat/FileSelector";
import { useToast } from "@/hooks/use-toast";
import withAuth from "../../../hoc/withAuth";

const ChatWithFiles = () => {
  const [uid, setUid] = useState<string | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatId, setChatId] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<{ filename: string, proDownloadUrl: string } | null>(null);
  const [isClient, setIsClient] = useState(false); // New state to check if we are in the client
  const placeholders = ["Ask a question...", "Chat with your file", "Get help from AI"];
  const { toast } = useToast();

  // Only access localStorage and set client-specific states after rendering on the client
  useEffect(() => {
    setIsClient(true); // Ensure client-side rendering

    const storedUid = localStorage.getItem("uid");
    setUid(storedUid);

    const storedUsername = localStorage.getItem("username");
    setUsername(storedUsername);
  }, []);

  // Firebase subscription for messages in the chat
  useEffect(() => {
    if (!chatId) return;

    const chatRef = doc(db, "chats", chatId);
    const unsubscribe = onSnapshot(chatRef, (snapshot) => {
      const chatData = snapshot.data();
      if (chatData && chatData.messages) {
        setMessages(chatData.messages);
      }
    });

    return () => unsubscribe();
  }, [chatId]);

  // Callback for model selection
  const handleModelSelection = (model: string) => {
    setSelectedModel(model);
  };

  // Callback for file selection
  const handleFileSelection = ({ filename, proDownloadUrl }: { filename: string, proDownloadUrl: string }) => {
    setSelectedFile({ filename, proDownloadUrl });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!uid || !username || !prompt || !selectedFile) {
      return;
    }

    setLoading(true);
    const newMessage = {
      prompt,
      response: "", 
      uid,
      fullName: username,
      createdAt: serverTimestamp(),
    };

    const payload = {
      user_id: uid,
      message: prompt,
      pdf_name: `P_${selectedFile.filename}`, 
      pdf_path: selectedFile.proDownloadUrl, 
    };

    try {
      const response = await fetch('https://c963-103-183-203-226.ngrok-free.app/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to send message');
      }

      const result = await response.json();
      console.log('Message sent:', result);

      const responseMessage = {
        ...newMessage,
        response: result.response,
        createdAt: new Date(), // For local usage
      };
      
      setMessages((prevMessages) => [...prevMessages, responseMessage]);
      setPrompt(""); // Clear the input field after message sent
      setLoading(false);
    } catch (error:unknown) {
      if (error instanceof Error) {
        toast({
          title: 'Custom Error',
          description: `Custom error occurred: ${error.message}`,
          variant: 'destructive',
        });
      } 
    }

    try {
      if (!chatId) {
        const newChat = {
          messages: [newMessage], 
          uid,
          fullName: username,
          createdAt: serverTimestamp(),
        };
        const chatRef = collection(db, "chats");
        const docRef = await addDoc(chatRef, newChat);
        setChatId(docRef.id);
      } else {
        const chatDocRef = doc(db, "chats", chatId);
        await updateDoc(chatDocRef, {
          messages: arrayUnion(newMessage), 
        });
      }
    } catch (error) {
      console.error("Error adding document: ", error);
    } finally {
      setLoading(false);
    }
  };

  // Render only if client-side
  

  return (
    <div className="h-[85vh] flex flex-col justify-end items-center px-4">
      <h2 className="mb-10 text-xl text-center sm:text-3xl">Ask Your Files 😎</h2>

      <div className="w-full max-h-[60vh] overflow-y-auto max-w-lg flex-grow flex flex-col">
        <MessagesList messages={messages} uid={uid} />
      </div>

      <div className="w-full max-w-lg mt-4">
        <PlaceholdersAndVanishInput
          placeholders={placeholders}
          onChange={(e) => setPrompt(e.target.value)}
          onSubmit={handleSubmit}
        />
        <div className="flex space-x-4 mt-4">
          <ModelSelection onModelSelect={handleModelSelection} />
          <FileSelection onFileSelect={handleFileSelection} />
        </div>
      </div>
    </div>
  );
};

export default withAuth(ChatWithFiles);
