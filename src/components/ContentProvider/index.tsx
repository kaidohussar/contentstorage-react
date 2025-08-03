import React, {
  createContext,
  useCallback,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from 'react';
import {
  fetchContent,
  initContentStorage,
  LanguageCode,
  setContentLanguage,
} from '@contentstorage/core';

type FetchStatus = 'idle' | 'loading' | 'failed';

interface ContentContextType {
  languageCodes: readonly LanguageCode[];
  status: FetchStatus;
  currentLanguageCode: LanguageCode;
  setLanguage: (lang: LanguageCode) => Promise<void>;
}

const ContentContext = createContext<ContentContextType | undefined>(undefined);

type ContentProviderProps<T extends readonly LanguageCode[]> = {
  children: ReactNode;
  languageCodes: T;
  onError?: (error: unknown) => void;
  loadingFallback?: React.ReactNode;
} & (
  | {
      contentMode: 'headless';
      contentKey: string;
    }
  | {
      contentMode: 'static';
      staticContent: { [K in T[number]]: object };
    }
);

export const ContentProvider = <const T extends readonly LanguageCode[]>(
  props: ContentProviderProps<T>
) => {
  const { children, languageCodes, onError, loadingFallback } = props;

  const [status, setStatus] = useState<FetchStatus>('loading');
  const [currentLanguageCode, setCurrentLanguageCode] = useState<LanguageCode>(
    languageCodes?.[0]
  );

  useEffect(() => {
    if (props.contentMode === 'headless') {
      initContentStorage({
        languageCodes: [...languageCodes],
        contentKey: props.contentKey,
      });
    } else if (
      props.contentMode === 'static' &&
      props.staticContent &&
      props.staticContent[languageCodes[0]]
    ) {
      setContentLanguage({
        languageCode: languageCodes[0],
        contentJson: props.staticContent[languageCodes[0]],
      });
    }
  }, [languageCodes, props.contentMode]);

  const setLanguage = useCallback(
    async (lang: LanguageCode) => {
      if (props.contentMode === 'headless') {
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
      } else {
        // contentMode is 'static'
        if (props.staticContent && props.staticContent[lang]) {
          setContentLanguage({
            languageCode: lang,
            contentJson: props.staticContent[lang],
          });
          setStatus('idle');
        } else {
          setStatus('failed');
          if (onError) {
            onError(
              new Error(`Static content not found for language: ${lang}`)
            );
          }
        }
      }
      setCurrentLanguageCode(lang);
    },
    [props.contentMode, onError]
  );

  useEffect(() => {
    if (languageCodes.length === 0) {
      setStatus('failed');
      return;
    }

    if (props.contentMode === 'static') {
      setStatus('idle');
      setCurrentLanguageCode(languageCodes[0]);
    } else {
      setLanguage(languageCodes[0]);
    }
  }, [languageCodes, props.contentMode, setLanguage]);

  return (
    <ContentContext.Provider
      value={{
        languageCodes,
        status,
        currentLanguageCode,
        setLanguage,
      }}
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
