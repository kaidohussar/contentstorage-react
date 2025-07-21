import React, { createContext, useContext, ReactNode } from 'react';

interface ContentContextType {
  languageCodes: string[];
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

interface ContentProviderProps {
  children: ReactNode;
  languageCodes: string[];
}

export const ContentProvider = ({
  children,
  languageCodes,
}: ContentProviderProps) => {
  return (
    <ContentContext.Provider value={{ languageCodes }}>
      {children}
    </ContentContext.Provider>
  );
};

export const useContent = () => {
  const context = useContext(ContentContext);
  if (context === undefined) {
    throw new Error('useContent must be used within a ContentProvider');
  }
  return context;
};
