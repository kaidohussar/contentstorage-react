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

interface ContentContextType {
  languageCodes: LanguageCode[];
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState(true);
  const [currentLanguageCode, setCurrentLanguageCode] = useState<LanguageCode>(
    languageCodes?.[0]
  );

  initContentStorage({
    languageCodes,
    contentKey,
  });

  const setLanguage = async (lang: LanguageCode) => {
    setIsLoading(true);
    try {
      await fetchContent(lang);
    } catch (error) {
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }

    setCurrentLanguageCode(lang);
  };

  useEffect(() => {
    if (languageCodes.length === 0) return;
    setLanguage(languageCodes[0]);
  }, []);

  return (
    <ContentContext.Provider
      value={{ languageCodes, isLoading, currentLanguageCode }}
    >
      {loadingFallback && isLoading ? loadingFallback : children}
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
