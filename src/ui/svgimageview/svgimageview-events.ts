import { ImageViewEvents } from '../imageview/imageview-events';

export const SvgImageViewEvents = {
  ...ImageViewEvents
} as const;

export type SvgImageViewEvents = ExtractValues<typeof SvgImageViewEvents>;