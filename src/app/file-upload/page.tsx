'use client';

import { useState, useCallback } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, db } from '@/lib/firebase';
import withAuth from "../../hoc/withAuth";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { doc, updateDoc, arrayUnion, getDoc, setDoc } from 'firebase/firestore';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const DocumentUploader = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isGovernmentID, setIsGovernmentID] = useState(false);
  const [isLLMKnowledgeBase, setIsLLMKnowledgeBase] = useState(false);

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    if (selectedFile.size > MAX_FILE_SIZE) {
      toast({
        title: 'Error',
        description: 'File size exceeds 10MB limit',
        variant: 'destructive',
      });
      setFile(null);
      return;
    }
    setFile(selectedFile);
  }, [toast]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop: handleDrop });

  const handleUpload = async () => {
    if (!file) {
      toast({
        title: 'Error',
        description: 'Please select a file to upload',
        variant: 'destructive',
      });
      return;
    }

    const uid = localStorage.getItem('uid');
    const storageRef = ref(storage, `users/${uid}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setUploadProgress(progress);
      },
      (error) => {
        toast({
          title: 'Upload failed',
          description: error.message,
          variant: 'destructive',
        });
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);

       // Check if metadata document exists, if not, create it
       const metadataDocRef = doc(db, 'metadata', uid);
       const metadataDocSnap = await getDoc(metadataDocRef);
       if (!metadataDocSnap.exists()) {
         // Create the metadata document if it does not exist
         await setDoc(metadataDocRef, {
           files: arrayUnion({
             filePath: `users/${uid}/${file.name}`,
             downloadURL,
             isGovernmentID,
             isLLMKnowledgeBase,
             uploadedAt: new Date().toISOString(),
           }),
         });
       } else {
         // If the metadata document exists, update it
         await updateDoc(metadataDocRef, {
           files: arrayUnion({
             filePath: `users/${uid}/${file.name}`,
             downloadURL,
             isGovernmentID,
             isLLMKnowledgeBase,
             uploadedAt: new Date().toISOString(),
           }),
         });
       }


        // Fetch current usedSpace
        const userDocRef = doc(db, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const currentUsedSpace = userDocSnap.data().storageInfo.usedSpace || 0;

          // Update Firestore storageInfo with the new used space
          await updateDoc(userDocRef, {
            'storageInfo.usedSpace': currentUsedSpace + file.size,
          });

          toast({
            title: 'Success',
            description: 'File uploaded successfully!',
          });
        } else {
          toast({
            title: 'Error',
            description: 'User data not found',
            variant: 'destructive',
          });
        }

        setUploadProgress(0);
        setFile(null);
      }
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center">
      <div className="flex flex-col md:flex-row w-full max-w-4xl mx-auto">
        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-lg font-semibold mb-4">Upload Document</h2>

          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-4 ${
              isDragActive ? 'border-blue-500' : 'border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="text-blue-500">Drop the files here ...</p>
            ) : (
              <p>Drag & drop a file here, or click to select one</p>
            )}
          </div>

          {file && (
            <div className="mt-4">
              <p>Selected file: {file.name}</p>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2">
            <Checkbox checked={isGovernmentID} onCheckedChange={setIsGovernmentID} />
            <Label>Is this a government or identity document?</Label>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Checkbox checked={isLLMKnowledgeBase} onCheckedChange={setIsLLMKnowledgeBase} />
            <Label>Use for LLM Knowledge Base?</Label>
          </div>

          <Button onClick={handleUpload} className="mt-4">
            Upload
          </Button>

          {uploadProgress > 0 && (
            <div className="mt-4">
              <p>Uploading: {uploadProgress}%</p>
              <Progress value={uploadProgress} />
            </div>
          )}

          <Toaster />
        </div>

        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-lg font-semibold mb-4">Why this matters</h2>
          <p className="mb-4">
            <strong>Government or Identity Document:</strong> It's crucial to keep your identity
            documents safe. Uploading them is safe on this platform.
            However, make sure to be cautious and upload only what is necessary.
          </p>
          <p>
            <strong>LLM Knowledge Base:</strong> If you choose to include this file in the LLM
            Knowledge Base, it will be used to improve and refine our language models. This can
            help our chatbot provide better, more accurate responses through retrieval-augmented
            generation (RAG) techniques.
          </p>
        </div>
      </div>
    </div>
  );
};

export default withAuth(DocumentUploader);
