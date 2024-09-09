'use client'

import { useState, useCallback } from 'react';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { storage, db } from '@/lib/firebase';
import withAuth from "../../../hoc/withAuth";
import { Button } from '@/components/ui/button';
import { useDropzone } from 'react-dropzone';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { doc, updateDoc, arrayUnion, getDoc, setDoc } from 'firebase/firestore';
import { jsPDF } from 'jspdf';  
import { Progress } from '@/components/ui/progress';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB in future we might increase 
const ALLOWED_IMAGE_FORMATS = ['png', 'jpg', 'jpeg'];
const ALLOWED_DOCUMENT_FORMATS = ['pdf', 'doc', 'docx', 'odf'];
//In future - 'tiff', 'gif', 'webp','ppt', 'pptx', 'txt', 'csv', 'json'


const DocumentUploader :React.FC = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [conversionProgress, setConversionProgress] = useState(0);
  const [isGovernmentID, setIsGovernmentID] = useState(false);
  const [isLLMKnowledgeBase, setIsLLMKnowledgeBase] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fileType, setFileType] = useState('');
  const [containsImages, setContainsImages] = useState(false);
  const [optimizingDialogOpen, setOptimizingDialogOpen] = useState(false);

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const selectedFile = acceptedFiles[0];
    const fileExtension = selectedFile.name.split('.').pop()?.toLowerCase();
    setFileType(fileExtension || '');

    if (selectedFile.size > MAX_FILE_SIZE) {
      toast({
        title: 'Error',
        description: 'File size exceeds 10MB limit',
        variant: 'destructive',
      });
      setFile(null);
      return;
    }

    if (ALLOWED_IMAGE_FORMATS.includes(fileExtension || '') || ALLOWED_DOCUMENT_FORMATS.includes(fileExtension || '')) {
      setFile(selectedFile);

      if (ALLOWED_IMAGE_FORMATS.includes(fileExtension || '')) {
        // Converting image to PDF if it's not already a PDF
        if (fileExtension !== 'pdf') {
          setOptimizingDialogOpen(true);
          convertImageToPDF(selectedFile);
        }
      } else {
        if (ALLOWED_DOCUMENT_FORMATS.includes(fileExtension || '')) {
          setDialogOpen(true);
        if (fileExtension !== 'pdf') {
          
          toast({
            title: 'Tips',
            description: '📄 This file will be converted and optimized before word extraction. PDF files donot require this.😊',
          });
        }
      }}
    } else {
      toast({
        title: 'Error',
        description: 'Unsupported file format',
        variant: 'destructive',
      });
      setFile(null);
    }
  }, [toast]);


  //Function to convert image to pdf for optimised data flow
  const convertImageToPDF = (imageFile: File) => {
    const reader = new FileReader();
    reader.readAsDataURL(imageFile);

    reader.onload = () => {
      const imgData = reader.result as string;
      const pdf = new jsPDF();
      const img = new Image();
      img.src = imgData;
      img.onload = () => {
        const imgWidth = pdf.internal.pageSize.getWidth();
        const imgHeight = (img.height * imgWidth) / img.width;
        pdf.addImage(img, 'JPEG', 0, 0, imgWidth, imgHeight);

        const pdfBlob = pdf.output('blob');
        const newFile = new File([pdfBlob], `${imageFile.name.split('.')[0]}.pdf`, { type: 'application/pdf' });
        setFile(newFile);
        setTimeout(() => {
          setOptimizingDialogOpen(false); 
          toast({
            title: 'Conversion Complete',
            description: 'Image has been converted to PDF.',
          });
        }, 3000);
      };
    };
  };

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
    const storageRef = ref(storage, `users/${uid}/unprocessed/${file.name}`);
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

        // Update metadata collection
        const metadataDocRef = doc(db, 'metadata', uid);
        const metadataDocSnap = await getDoc(metadataDocRef);

        const fileMetadata = {
          filePath: `users/${uid}/unprocessed/${file.name}`,
          downloadURL,
          isGovernmentID,
          isLLMKnowledgeBase,
          containsImages,
          fileType,
          proDownloadUrl: ' ',
          processedfilePath: ' ',
          isProcessed: false,
          processedText: '',
          processedJSON: '',
          uploadedAt: new Date().toISOString(),
          fileSize: file.size,
        };

        if (!metadataDocSnap.exists()) {
          await setDoc(metadataDocRef, {
            files: arrayUnion(fileMetadata),
          });
        } else {
          await updateDoc(metadataDocRef, {
            files: arrayUnion(fileMetadata),
          });
        }

        // Update storage usage
        const userDocRef = doc(db, 'users', uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const currentUsedSpace = userDocSnap.data().storageInfo.usedSpace || 0;
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

        const payload = {
          input_filename: file.name,
          output_filename: `P_${file.name}`,
          uid: uid,
        };
  
        try {
          const response = await fetch('https://c963-103-183-203-226.ngrok-free.app/trigger-pdf-processing', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
  
          if (!response.ok) {
            throw new Error('Failed to process the file');
          }
  
          const data = await response.json();
          console.log('File processed successfully:', data);
          toast({
            title: 'File Processing',
            description: 'Your file is being processed. You will be notified when it is ready.',
          });
        } catch (error) {
          toast({
            title: 'Error',
            description: `File processing failed: ${error.message}`,
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
            <div className="mt-4 bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4">
              <p className="font-bold">Selected file: {file.name}</p>
            </div>
          )}

          <div className="mt-4 flex items-center gap-2">
            <Checkbox checked={isGovernmentID} onCheckedChange={setIsGovernmentID} />
            <span>Is this a government or identity document?</span>
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Checkbox checked={isLLMKnowledgeBase} onCheckedChange={setIsLLMKnowledgeBase} />
            <span>Use for LLM Knowledge Base?</span>
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

          <div className="mt-4 text-sm text-gray-500 border-t pt-2">
            <p>
              <strong>Allowed File Formats:</strong> png, jpg, jpeg, webp, pdf, doc, docx, odf
            </p>
          </div>
      
        </div>

        <div className="w-full md:w-1/2 p-4">
          <h2 className="text-lg font-semibold mb-4">Why this matters</h2>
          <p className="mb-4">
            <strong>Government or Identity Document:</strong> It&apos;s crucial to keep your identity
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

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Does the document contain images?</DialogTitle>
            <DialogDescription>
              This helps us use the appropriate model or technique to extract text efficiently.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-4 mt-4">
            <Button variant="outline" onClick={() => { setContainsImages(true); setDialogOpen(false); }}>
              Yes
            </Button>
            <Button variant="outline" onClick={() => { setContainsImages(false); setDialogOpen(false); }}>
              No
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Optimizing/Converting File Dialog */}
      <Dialog open={optimizingDialogOpen} onOpenChange={setOptimizingDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Optimizing and Converting</DialogTitle>
            <DialogDescription>
              Please wait while we optimize and convert your document to PDF.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <progress value={conversionProgress} max="100" />
            <p className="mt-2 text-center">{conversionProgress}% Complete</p>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Does the document contain images?</DialogTitle>
            <DialogDescription>
              This helps us use the appropriate model or technique to extract text efficiently.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-center gap-4 mt-4">
            <Button variant="outline" onClick={() => { setContainsImages(true); setDialogOpen(false); }}>
              Yes
            </Button>
            <Button variant="outline" onClick={() => { setContainsImages(false); setDialogOpen(false); }}>
              No
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default withAuth(DocumentUploader);
