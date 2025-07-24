import { useContent } from '../../components/ContentProvider';

export const useManageLanguage = () => {
  const { currentLanguageCode, setLanguage, languageCodes } = useContent();

  const handleSetLanguage = (languageCode: (typeof languageCodes)[number]) => {
    if (languageCode === currentLanguageCode) return;

    setLanguage(languageCode);
  };

  return { languageCodes, currentLanguageCode, setLanguage: handleSetLanguage };
};
