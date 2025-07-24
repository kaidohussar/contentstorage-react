import { useContent } from '../../components/ContentProvider';

export const useIsFetchingContent = () => {
  const { status } = useContent();
  return { status };
};
