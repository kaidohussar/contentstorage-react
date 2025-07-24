import { getImage, type ContentStructure } from '@contentstorage/core';
import React from 'react';

export function Image<Path extends keyof ContentStructure>({
  contentId,
  ...rest
}: {
  contentId: Path;
} & React.ImgHTMLAttributes<HTMLImageElement>) {
  const image = getImage(contentId);

  if (!image?.data) {
    return contentId;
  }

  return <img src={image.data.url} alt={image.data.altText} {...rest} />;
}
