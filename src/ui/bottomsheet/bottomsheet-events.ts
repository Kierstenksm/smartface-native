export const BottomSheetEvents = {
  Dismissed: 'dismissed'
} as const;

export type BottomSheetEvents = ExtractValues<typeof BottomSheetEvents>;
