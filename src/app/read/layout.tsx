'use client'

import ServiceNavigation from '@/components/navigationBar/ServiceNavigation';
import React , { useEffect, useState } from 'react';
import { getDoc } from 'firebase/firestore';
import {db, doc} from '@/lib/firebase';

export default function ReadLayout({ children }: { children: React.ReactNode }) {
   
  return (
    <section>
        <p></p>
      {children}
    </section>
  );
}