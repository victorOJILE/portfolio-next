'use client';

import { createContext, useContext, useState, ReactNode } from 'react';

interface ContactRequestContextType {
  requestedSubject: string;
  requestedMessage: string;
  setContactRequest: (subject: string, message: string) => void;
}

const ContactRequestContext = createContext<ContactRequestContextType | undefined>(undefined);

export default function ContactRequestProvider({ children }: { children: ReactNode }) {
  const [requestedSubject, setRequestedSubject] = useState('');
  const [requestedMessage, setRequestedMessage] = useState('');

  const setContactRequest = (subject: string, message: string) => {
    setRequestedSubject(subject);
    setRequestedMessage(message);
  };

  return (
    <ContactRequestContext.Provider value={{ requestedSubject, requestedMessage, setContactRequest }}>
      {children}
    </ContactRequestContext.Provider>
  );
}

export function useContactRequest() {
  const context = useContext(ContactRequestContext);
  if (!context) {
    throw new Error('useContactRequest must be used within ContactRequestProvider');
  }
  return context;
}