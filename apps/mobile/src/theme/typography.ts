import { TextStyle } from "react-native";

export const fontFamily = {
  regular: 'Inter-Regular',
  medium: 'Inter-Medium',
  semiBold: 'Inter-SemiBold',
  bold: 'Inter-Bold',
  extraBold: 'Inter-ExtraBold',
} as const;

export const typography = {
  heading1: {
    fontFamily: fontFamily.bold,
    fontSize: 48,
    lineHeight: 58,
  },
  heading2: {
    fontFamily: fontFamily.bold,
    fontSize: 40,
    lineHeight: 48,
  },
  heading3: {
    fontFamily: fontFamily.bold,
    fontSize: 32,
    lineHeight: 38,
  },
  heading4: {
    fontFamily: fontFamily.bold,
    fontSize: 24,
    lineHeight: 29,
  },
  heading5: {
    fontFamily: fontFamily.bold,
    fontSize: 20,
    lineHeight: 24,
  },
  heading6: {
    fontFamily: fontFamily.bold,
    fontSize: 18,
    lineHeight: 22,
  },

  bodyXLarge: {
    fontFamily: fontFamily.regular,
    fontSize: 18,
    lineHeight: 27,
  },
  bodyLarge: {
    fontFamily: fontFamily.regular,
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 21,
  },
  bodySmall: {
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 18,
  },
  bodyXSmall: {
    fontFamily: fontFamily.regular,
    fontSize: 10,
    lineHeight: 15,
  },
} as const;

export type TypographyVariant = keyof typeof typography;
export type TypographyWeight = keyof typeof fontFamily;

export function getTypography(
  variant: TypographyVariant,
  weight?: TypographyWeight,
): TextStyle {
  return {
    ...typography[variant],
    ...(weight ? { fontFamily: fontFamily[weight] } : {}),
  };
}