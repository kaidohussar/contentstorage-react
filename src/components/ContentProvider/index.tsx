import React, {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import {
  fetchContent,
  initContentStorage,
  LanguageCode,
} from '@contentstorage/core';

type FetchStatus = 'idle' | 'loading' | 'failed';

interface ContentContextType {
  languageCodes: LanguageCode[];
  status: FetchStatus;
  currentLanguageCode: LanguageCode;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

interface ContentProviderProps {
  children: ReactNode;
  languageCodes: LanguageCode[];
  onError?: (error: unknown) => void;
  loadingFallback?: React.ReactNode;
  contentKey: string;
}

export const ContentProvider = ({
  children,
  languageCodes,
  onError,
  loadingFallback,
  contentKey,
}: ContentProviderProps) => {
  const [status, setStatus] = useState<FetchStatus>('loading');
  const [currentLanguageCode, setCurrentLanguageCode] = useState<LanguageCode>(
    languageCodes?.[0]
  );

  initContentStorage({
    languageCodes,
    contentKey,
  });

  const setLanguage = async (lang: LanguageCode) => {
    setStatus('loading');
    try {
      await fetchContent(lang);
      setStatus('idle');
    } catch (error) {
      setStatus('failed');
      if (onError) {
        onError(error);
      }
    }

    setCurrentLanguageCode(lang);
  };

  useEffect(() => {
    if (languageCodes.length === 0) {
      setStatus('failed');
      return;
    }
    setLanguage(languageCodes[0]);
  }, []);

  return (
    <ContentContext.Provider
      value={{ languageCodes, status, currentLanguageCode }}
    >
      {loadingFallback && status === 'loading' ? loadingFallback : children}
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
