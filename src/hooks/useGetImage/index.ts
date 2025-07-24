import { getImage, type ContentStructure } from '@contentstorage/core';

export function useGetImage<Path extends keyof ContentStructure>({
  contentId,
}: {
  contentId: Path;
}) {
  const image = getImage(contentId);

  if (!image?.data) {
    return {
      url: '',
      altText: '',
    };
  }

  return image.data;
}
