import { ImageViewEvents } from '../imageview/imageview-events';

export const SVGImageViewEvents = {
  ...ImageViewEvents
} as const;

export type SVGImageViewEvents = ExtractValues<typeof SVGImageViewEvents>;