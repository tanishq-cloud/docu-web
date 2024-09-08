import { onSnapshot } from 'firebase/firestore';
import { db, doc } from '@/lib/firebase';
import { useState, useMemo, useEffect } from "react";
import { useToast } from '@/hooks/use-toast';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@nextui-org/react";

const FileSelection = ({ onFileSelect }) => {
  const [selectedFile, setSelectedFile] = useState(new Set(["Select File"])); // Default label as "Select File"
  const [files, setFiles] = useState([]);
  const [uid, setUid] = useState(null);
  const { toast } = useToast();

  useEffect(() => {
    const uid = localStorage.getItem('uid');
    setUid(uid);

    const fetchFiles = async () => {
      if (!uid) return; // Handle when uid is not available yet

      try {
        const fileRef = doc(db, "metadata", uid);
        const unsubscribe = onSnapshot(fileRef, (snapshot) => {
          const fileData = snapshot.data();
          if (fileData && fileData.files && fileData.files.length > 0) {
            setFiles(fileData.files);
          } else {
            setFiles([]); // Set empty array if no files present
          }
        });

        return () => unsubscribe();
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

  const handleSelectionChange = (keys) => {
    setSelectedFile(keys);
    const selectedKey = Array.from(keys)[0];
    const selectedFileData = files.find(file => file.processedfilePath?.split('/').pop() === selectedKey);

    if (selectedFileData) {
      const { proDownloadUrl } = selectedFileData;
      const filename = selectedFileData.processedfilePath?.split('/').pop();

      if (onFileSelect && filename && proDownloadUrl) {
        onFileSelect({ filename, proDownloadUrl });
      }
    }
  };

  const selectedFileLabel = useMemo(
    () => Array.from(selectedFile).join(", ").replaceAll("_", " "),
    [selectedFile]
  );

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="bordered" className="capitalize">
          {selectedFileLabel}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Select File"
        variant="flat"
        disallowEmptySelection
        selectionMode="single"
        selectedKeys={selectedFile}
        onSelectionChange={handleSelectionChange}
      >
        {files.length > 0 ? (
          files.map((file) => (
            <DropdownItem key={file.processedfilePath?.split('/').pop()}>
              {file.processedfilePath?.split('/').pop() || "Unnamed File"}
            </DropdownItem>
          ))
        ) : (
          <DropdownItem key="no-files" disabled>
            No files available
          </DropdownItem>
        )}
      </DropdownMenu>
    </Dropdown>
  );
};

export default FileSelection;
