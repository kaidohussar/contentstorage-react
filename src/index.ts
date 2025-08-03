import type { LanguageCode } from '@contentstorage/core';
import { getText, getImage, getVariation } from '@contentstorage/core';

export * from './components/ContentProvider';
export * from './hooks';
export * from './components/Text';
export * from './components/Variation';
export * from './components/Image';
export { LanguageCode, getImage, getVariation, getText };
