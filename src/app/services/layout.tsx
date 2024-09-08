'use client'

import ServiceNavigation from '@/components/navigationBar/ServiceNavigation';
import React , { useEffect, useState } from 'react';
import { getDoc } from 'firebase/firestore';
import {db, doc} from '@/lib/firebase';

export default function ServiceLayout({ children }: { children: React.ReactNode }) {
    const [uid, setUid] = useState<string | null>(null); // Initializing with null to avoid undefined errors
    const [username, setUsername] = useState<string>();

    useEffect(() => {
      const storedUid = localStorage.getItem('uid');
      setUid(storedUid);

      // Check if uid exists before fetching the user document
      if (storedUid) {
        const fetchUserData = async () => {
          try {
            const userDocRef = doc(db, 'users', storedUid); // Use storedUid here
            const userDocSnap = await getDoc(userDocRef);
      
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              const fullName = userData?.fullName; 
              localStorage.setItem('username', fullName);
              setUsername(fullName); 
            } else {
              console.log("No such document!");
            }
          } catch (error) {
            console.error("Error fetching user document:", error);
          }
        };

        fetchUserData(); 
      }
    }, []); 
  return (
    <>
    <section>
        <ServiceNavigation uid={uid} username={username}/>
    </section> {children}</>
  );
}