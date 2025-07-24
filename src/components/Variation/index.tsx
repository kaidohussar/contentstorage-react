import { getVariation, type ContentStructure } from '@contentstorage/core';

export function Variation<Path extends keyof ContentStructure>({
  contentId,
  variationId,
  variables,
}: {
  contentId: Path;
  variationId?: ContentStructure[Path] extends { data: infer D }
    ? keyof D
    : string;
  variables?: Record<string, unknown>;
}) {
  return getVariation(contentId, variationId, variables) || contentId;
}
