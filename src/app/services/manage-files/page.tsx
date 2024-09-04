'use client';

import { useState, useEffect } from 'react';
import { ref, listAll, getDownloadURL, getMetadata } from 'firebase/storage';
import { storage } from '@/lib/firebase';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { FileText, Image, Video, FileType, FileCode, FileIcon, Upload } from 'lucide-react'; 
import Link from 'next/link';
import { PieChartComponent } from '@/components/ChartsUtility';
import { RadialChart } from '@/components/RadialSpace';

const FileExplorer = () => {
  const tjtj = 100*1024*1024;
  const { toast } = useToast();
  const [files, setFiles] = useState<any[]>([]);
  const [viewMode, setViewMode] = useState<'card' | 'table'>('card');
  const [totalSize, setTotalSize] = useState<number>(0);
  const [fileTypeData, setFileTypeData] = useState<any[]>([]); 
  const uid = localStorage.getItem('uid')
  
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const userFolderRef = ref(storage, `users/${uid}/`);
        const fileList = await listAll(userFolderRef);
        const fileData = await Promise.all(
          fileList.items.map(async (fileRef) => {
            const url = await getDownloadURL(fileRef);
            const metadata = await getMetadata(fileRef);
            return {
              name: fileRef.name,
              fullPath: fileRef.fullPath,
              url,
              size: metadata.size,
              contentType: metadata.contentType,
              uploaded: metadata.timeCreated,
            };
          })
        );

        // Calculating total size and file types
        const total = fileData.reduce((acc, file) => acc + file.size, 0);
        const fileTypes = fileData.reduce((acc, file) => {
          const type = getFileType(file.contentType || '');
          const existing = acc.find(t => t.type === type);
          if (existing) {
            existing.size += file.size;
          } else {
            acc.push({ type, size: file.size });
          }
          return acc;
        }, []);

        setFiles(fileData);
        setTotalSize(total);
        setFileTypeData(fileTypes);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to load files',
          variant: 'destructive',
        });
      }
    };

    fetchFiles();
  }, [uid, toast]);

  const getFileIcon = (type: string) => {
    if (type.includes('image')) return <Image />;
    if (type.includes('pdf')) return <FileType />;
    if (type.includes('video')) return <Video />;
    if (type.includes('text')) return <FileText />;
    if (type.includes('json') || type.includes('csv') || type.includes('code')) return <FileCode />;
    return <FileIcon />;
  };

  const getFileType = (type: string) => {
    if (type.includes('image')) return 'Image';
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
            <Card key={idx}>
              <CardHeader>
                <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <CardTitle>{truncateFileName(file.name)}</CardTitle>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{file.name}</p>
                  </TooltipContent>
                </Tooltip>
                </TooltipProvider>
              </CardHeader>
              <CardContent className="flex justify-center">
                {getFileIcon(file.contentType)}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" onClick={() => window.open(file.url, '_blank')}>
                  View File
                </Button>
                <Popover>
                  <PopoverTrigger>
                    <Button variant="outline">More Info</Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <p><strong>Name:</strong> {file.name}</p>
                    <p><strong>Type:</strong> {getFileType(file.contentType)}</p>
                    <p><strong>Size:</strong> {formatFileSize(file.size)}</p>
                    <p><strong>Uploaded:</strong> {new Date(file.uploaded).toLocaleString()}</p>
                  </PopoverContent>
                </Popover>
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
                        {truncateFileName(file.name)}
                      </TooltipTrigger>
                      <TooltipContent>{file.name}</TooltipContent>
                    </Tooltip>
                    </TooltipProvider>
                  </TableCell>
                  <TableCell>{getFileType(file.contentType)}</TableCell>
                  <TableCell>{formatFileSize(file.size)}</TableCell>
                  <TableCell>{new Date(file.uploaded).toLocaleString()}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button variant="outline" onClick={() => window.open(file.url, '_blank')}>
                      View File
                    </Button>
                    <Popover>
                      <PopoverTrigger>
                        <Button variant="outline">More Info</Button>
                      </PopoverTrigger>
                      <PopoverContent>
                        <p><strong>Name:</strong> {file.name}</p>
                        <p><strong>Type:</strong> {getFileType(file.contentType)}</p>
                        <p><strong>Size:</strong> {formatFileSize(file.size)}</p>
                        <p><strong>Uploaded:</strong> {new Date(file.uploaded).toLocaleString()}</p>
                      </PopoverContent>
                    </Popover>
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

export default FileExplorer;
