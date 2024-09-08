'use client';

import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { FileText, Image, Video, FileType, FileCode, FileIcon, Upload, Download } from 'lucide-react'; 
import Link from 'next/link';
import { RadialChart } from '@/components/charts/RadialSpace';
import withAuth from "../../../hoc/withAuth";
//import ProcessedFileDialog from '@/components/manage-files/ProcessedFileDialog';
import dynamic from 'next/dynamic';

// Dynamically import ProcessedFileDialog with SSR disabled
const ProcessedFileDialog = dynamic(() => import('@/components/manage-files/ProcessedFileDialog'), {
  ssr: false,
});
const FileExplorer = () => {
  const tjtj = 100*1024*1024;
  const { toast } = useToast();
  const [files, setFiles] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [totalSize, setTotalSize] = useState<number>(0);
  const [uid, setUid] = useState<string | null>(null);


  useEffect(() => {
    const fetchFiles = async () => {
      if (!uid) return;
      try {
        const fileRef = doc(db, "metadata", uid);
        const unsubscribe = onSnapshot(fileRef, (snapshot) => {
          const fileData = snapshot.data();
          if (fileData && fileData.files) {
            const filesArray = fileData.files;
            const total = filesArray.reduce((acc, file) => acc + file.fileSize, 0);
            setFiles(filesArray);
            setTotalSize(total);
          }
        });

        return () => unsubscribe();
      } catch (error) {
        toast({
          title: 'Error',
          description: `Failed to load files: ${error.message}`,
          variant: 'destructive',
        });
      }
    };

    // Assuming uid is stored in localStorage and can be retrieved
    const storedUid = localStorage.getItem('uid');
    if (storedUid) {
      setUid(storedUid);
      fetchFiles();
    }
  }, [uid, toast]);

  const getFileIcon = (type: string) => {
    if (type.includes('image') || type.includes('png') || type.includes('jpg')) return <Image />;
    if (type.includes('pdf')) return <FileType />;
    if (type.includes('video')) return <Video />;
    if (type.includes('text')) return <FileText />;
    if (type.includes('json') || type.includes('csv') || type.includes('code')) return <FileCode />;
    return <FileIcon />;
  };

  const getFileType = (type: string) => {
    if (type.includes('image') || type.includes('png') || type.includes('jpg')) return 'Image';
    if (type.includes('pdf')) return 'PDF';
    if (type.includes('video')) return 'Video';
    if (type.includes('text')) return 'Text';
    if (type.includes('json') || type.includes('csv') || type.includes('code')) return 'Code';
    return 'Other';
  };

  const truncateFileName = (name: string, length: number = 20) =>
    name.length > length ? `${name.substring(0, length)}...` : name;

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(2)} KB`;
    if (bytes < 1073741824) return `${(bytes / 1048576).toFixed(2)} MB`;
    return `${(bytes / 1073741824).toFixed(2)} GB`;
  };

  return (
    <div className="min-h-screen p-4 space-y-4">
      {/* Chart Section */}
      <div className="mb-8">
        <div className="flex gap-4 mb-4">
          <RadialChart usedSpace={totalSize} totalSpace={tjtj}/>
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <span>Card View</span>
          <Switch 
            checked={viewMode === 'table'}
            onCheckedChange={() => setViewMode(viewMode === 'card' ? 'table' : 'card')}
          />
          <span>Table View</span>
        </div>

        <Link href="/services/file-upload">
          <Button>
            <Upload className="mr-2 h-4 w-4" /> Upload File
          </Button>
        </Link>
      </div>

      {viewMode === 'card' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {files.map((file, idx) => (
            <Card key={idx} className="p-4">
              <CardHeader>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <CardTitle>{truncateFileName(file.filePath.split('/').pop())}</CardTitle>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{file.filePath.split('/').pop()}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardHeader>
              <CardContent className="flex justify-center">
                {getFileIcon(file.fileType)}
              </CardContent>
              <CardFooter className="flex justify-between">
              {/* <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                    <Button variant="outline" onClick={() => window.open(file.downloadURL, '_blank')}>
                      View File
                    </Button>
                    </TooltipTrigger>
                        <TooltipContent>
                          <p>View & Download Original File</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider> */}
                    <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                    <Button variant="outline" onClick={() => window.open(file.proDownloadUrl, '_blank')} disabled={!file.isProcessed}>
                      <Download className="mr-2 h-4 w-4" />
                    </Button>
                    </TooltipTrigger>
                        <TooltipContent>
                          <p>View & Download Processed File</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Popover>
                  <PopoverTrigger>
                    <Button variant="outline">More Info</Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <p><strong>Name:</strong> {file.filePath.split('/').pop()}</p>
                    <p><strong>Type:</strong> {file.fileType}</p>
                    <p><strong>Size:</strong> {formatFileSize(file.fileSize)}</p>
                    <p><strong>Uploaded:</strong> {new Date(file.uploadedAt).toLocaleString()}</p>
                  </PopoverContent>
                </Popover>
                <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                    <ProcessedFileDialog 
                    processedJSON={file.processedJSON} 
                    processedText={file.processedText}
                    />
                    </TooltipTrigger>
                        <TooltipContent>
                          <p>View Text and Json</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>File Name</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Uploaded</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map((file, idx) => (
                <TableRow key={idx}>
                  <TableCell>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          {truncateFileName(file.filePath.split('/').pop())}
                        </TooltipTrigger>
                        <TooltipContent>{file.filePath.split('/').pop()}</TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>{getFileType(file.fileType)}</TableCell>
                  <TableCell>{formatFileSize(file.fileSize)}</TableCell>
                  <TableCell>{new Date(file.uploadedAt).toLocaleString()}</TableCell>
                  <TableCell className="flex gap-2">
                  {/* <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                    <Button variant="outline" onClick={() => window.open(file.downloadURL, '_blank')}>
                      View File
                    </Button>
                    </TooltipTrigger>
                        <TooltipContent>
                          <p>View & Download Original File</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider> */}
                    <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                    <Button variant="outline" onClick={() => window.open(file.proDownloadUrl, '_blank')} disabled={!file.isProcessed}>
                      <Download className="mr-2 h-4 w-4" />
                    </Button>
                    </TooltipTrigger>
                        <TooltipContent>
                          <p>View & Download Processed File</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                    <Popover>
                  <PopoverTrigger>
                    <Button variant="outline">More Info</Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <p><strong>Name:</strong> {file.filePath.split('/').pop()}</p>
                    <p><strong>Type:</strong> {file.fileType}</p>
                    <p><strong>Size:</strong> {formatFileSize(file.fileSize)}</p>
                    <p><strong>Uploaded:</strong> {new Date(file.uploadedAt).toLocaleString()}</p>
                  </PopoverContent>
                </Popover>
                <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                    <ProcessedFileDialog 
                    processedJSON={file.processedJSON} 
                    processedText={file.processedText}
                    />
                    </TooltipTrigger>
                        <TooltipContent>
                          <p>View Text and Json</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
};

export default withAuth(FileExplorer);
