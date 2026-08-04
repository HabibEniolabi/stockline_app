import type { ReactNode } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  type PressableProps,
  type StyleProp,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { colors } from '../../theme/colors';
import { getTypography } from '../../theme/typography';

export type ButtonVariant = 'primary' | 'outline' | 'social';

type ButtonProps = Omit<PressableProps, 'children' | 'style'> & {
  title: string;
  variant?: ButtonVariant;
  loading?: boolean;
  fullWidth?: boolean;
  leftIcon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
};

export function Button({
  title,
  variant = 'primary',
  loading = false,
  fullWidth = true,
  leftIcon,
  disabled,
  style,
  textStyle,
  ...pressableProps
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{
        disabled: isDisabled,
        busy: loading,
      }}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        fullWidth && styles.fullWidth,
        styles[variant],
        pressed && styles[`${variant}Pressed`],
        isDisabled && styles.disabled,
        style,
      ]}
      {...pressableProps}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={
            variant === 'primary'
              ? colors.other.white
              : colors.primary[100]
          }
        />
      ) : (
        <>
          {leftIcon}
          <Text
            style={[
              styles.text,
              styles[`${variant}Text`],
              textStyle,
            ]}
          >
            {title}
          </Text>
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 56,
    minWidth: 96,
    borderRadius: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },

  fullWidth: {
    width: '100%',
  },

  primary: {
    backgroundColor: colors.primary[100],
    borderWidth: 1.2,
    borderColor: colors.primary[100],
  },

  primaryPressed: {
    backgroundColor: colors.primary[200],
    borderColor: colors.primary[200],
  },

  outline: {
    backgroundColor: colors.other.white,
    borderWidth: 1.2,
    borderColor: colors.primary[100],
  },

  outlinePressed: {
    backgroundColor: colors.primary[0],
  },

  social: {
    backgroundColor: colors.other.white,
    borderWidth: 1.2,
    borderColor: colors.neutral[200],
  },

  socialPressed: {
    backgroundColor: colors.neutral[25],
  },

  disabled: {
    opacity: 0.5,
  },

  text: {
    ...getTypography('heading6', 'semiBold'),
    lineHeight: 20,
    textAlign: 'center',
  },

  primaryText: {
    color: colors.other.white,
  },

  outlineText: {
    color: colors.primary[100],
  },

  socialText: {
    color: colors.neutral[900],
  },
});