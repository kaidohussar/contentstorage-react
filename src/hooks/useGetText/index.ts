import { getText, type ContentStructure } from '@contentstorage/core';

export function useGetText<Path extends keyof ContentStructure>({
  contentId,
  variables,
}: {
  contentId: Path;
  variables?: ContentStructure[Path] extends { variables: infer Vars }
    ? keyof Vars
    : Record<string, unknown>;
}) {
  return getText(contentId, variables).text || contentId;
}
