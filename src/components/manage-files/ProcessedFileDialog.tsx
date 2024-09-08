'use client';

import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogDescription} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import ReactJson from '@microlink/react-json-view';
import { Copy } from "lucide-react";
import { Label} from '../ui/label';
import { Input } from '../ui/input';
import { useToast } from '@/hooks/use-toast';
import { Toaster } from '@/components/ui/toaster';
import { useState, useEffect } from 'react';
import MarkdownEditor from '@uiw/react-markdown-editor';

interface ProcessedFileDialogProps {
  processedText: string;
  processedJSON: string;
}

const ProcessedFileDialog: React.FC<ProcessedFileDialogProps> = ({  processedText, processedJSON }) => {
  
    const [jsonObject, setJsonObject] = useState({}); // To store parsed JSON
    
    useEffect(() => {
      // Parse the JSON safely
      try {
        const parsedJSON = JSON.parse(processedJSON);
        setJsonObject(parsedJSON);
      } catch (err) {
        console.error("Error parsing JSON: ", err);
        setJsonObject({ error: "Invalid JSON" });
      }
    }, [processedJSON]);
  const { toast } = useToast();
  const handleCopyText = () => {
    navigator.clipboard.writeText(processedText).then(() => {
        toast({
            title: 'Text Copied to clipboard'
          });
    });
  };
  

  return (
    <div >
    <Dialog >
        <DialogTrigger asChild>
        <Button variant="outline">Processed</Button>
      </DialogTrigger>
      {/* <DialogTitle>Processed File Information</DialogTitle> */}
      <DialogContent className='max-w-3xl'>

    <DialogHeader>
      <DialogTitle>Processed File Information</DialogTitle>
      <DialogDescription>
        <Tabs defaultValue='text'>
        <TabsList className="grid w-full grid-cols-2">
             <TabsTrigger value="text">Text</TabsTrigger>
             <TabsTrigger value="json">JSON</TabsTrigger>
         </TabsList>
        
        <TabsContent value="text">
          <div className="p-4 h-96 overflow-auto">
          <Button onClick={handleCopyText} size="sm" className="px-3">
            <span className="sr-only">Copy</span>
            <Copy className="h-4 w-4" />
          </Button>
            <MarkdownEditor.Markdown source={processedText}  />
          </div>
        </TabsContent>
        <TabsContent value='json'>
          <div className="p-4 h-96 overflow-auto">
            <ReactJson src={jsonObject} theme="monokai" />
          </div>
        </TabsContent></Tabs>
        </DialogDescription>
        </DialogHeader>
      </DialogContent>
     
    </Dialog>

    <Toaster />
    </div>
  );
};

export default ProcessedFileDialog;
