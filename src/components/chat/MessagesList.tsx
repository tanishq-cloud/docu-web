import React, {useEffect, useRef} from 'react';
import { Card, CardHeader, CardBody, CardFooter, Avatar } from "@nextui-org/react"; 
import MarkdownEditor from '@uiw/react-markdown-editor';
const MessagesList: React.FC<{ messages: any[]; uid: string | null }> = ({ messages, uid }) => {
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
  
    // Scroll to the bottom whenever new messages are added
    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);
    return (
      <div className="flex flex-col items-center space-y-4">
        {messages.map((message, index) => (
          <Card
            key={index}
            className={`w-full max-w-lg ${message.uid === uid ? "self-end" : "self-start"}`}
          >
            <CardHeader className="justify-between">
              <div className="flex gap-5">
                <Avatar
                  isBordered
                  radius="full"
                  size="md"
                  src={
                    message.uid === uid
                      ? "/path-to-user-avatar.png" // User's Avatar URL
                      : "/path-to-ai-avatar.png" // AI's Avatar URL
                  }
                />
                <div className="flex flex-col gap-1 items-start justify-center">
                  <h4 className="text-small font-semibold leading-none text-default-600">
                    {message.uid === uid ? message.fullName : "AI"}
                  </h4>
                  <span className="text-xs text-gray-500">{message.createdAt?.toLocaleString()}</span>
                </div>
              </div>
            </CardHeader>
            <CardBody className="px-3 py-0 text-small text-default-400">
              <p className="text-sm text-gray-800">{message.prompt}</p>
              {message.response && (
                <p className="text-sm mt-2 italic text-gray-600">AI: <MarkdownEditor.Markdown source={message.response}  /></p>
              )}
            </CardBody>
            <CardFooter className="flex gap-2">
              <p className="text-xs text-gray-400">
                AI response
              </p>
            </CardFooter>
          </Card>
        ))}
        <div ref={messagesEndRef} />
      </div>
    );
  };
  
  export default MessagesList;