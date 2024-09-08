'use client'

import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { IconEdit } from '@tabler/icons-react'; 

const ProfileSettings = () => {
  const [uid, setUid] = useState<string | null>(null);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [newFullName, setNewFullName] = useState<string>(''); // for editing form
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  useEffect(() => {
    const storedUid = localStorage.getItem('uid');
    if (storedUid) {
      setUid(storedUid);
      fetchUserData(storedUid);
    }
  }, []);

  const fetchUserData = async (uid: string) => {
    try {
      const userDocRef = doc(db, 'users', uid);
      const userDocSnap = await getDoc(userDocRef);
      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setFullName(userData?.fullName || '');
        setUsername(userData?.username || '');
        setEmail(userData?.email || '');
      } else {
        console.log('No such document!');
      }
    } catch (error) {
      console.error('Error fetching user document:', error);
    }
  };

  const handleFormSubmit = async () => {
    if (uid) {
      try {
        const userDocRef = doc(db, 'users', uid);
        await updateDoc(userDocRef, { fullName: newFullName || fullName });
        toast({
          title: 'Profile Updated',
          description: 'Your profile has been updated successfully.',
          duration: 2000,
        });
        setTimeout(() => {
          router.push('/services/manage-files'); // Redirect after 2 seconds
        }, 2000);
        setIsDialogOpen(false); // Close the dialog after submitting
      } catch (error) {
        console.error('Error updating document:', error);
      }
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-6">Profile Settings</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium">Username</label>
        <Input value={username} disabled />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Email</label>
        <Input value={email} disabled />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium">Full Name</label>
        <Input value={fullName} disabled />
      </div>

      {/* Edit Button */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            <IconEdit size={16} />
            Edit Profile
          </Button>
        </DialogTrigger>

        {/* Dialog for editing the profile */}
        <DialogContent>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update your full name below and click 'Save' to update your profile information.
          </DialogDescription>

          <div className="mb-4">
            <label className="block text-sm font-medium">Full Name</label>
            <Input
              value={newFullName}
              onChange={(e) => setNewFullName(e.target.value)}
              placeholder="Enter new full name"
            />
          </div>

          <Button onClick={handleFormSubmit}>Save</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProfileSettings;
