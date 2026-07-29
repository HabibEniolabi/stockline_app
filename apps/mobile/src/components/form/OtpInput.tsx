import { useRef, useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';

type OtpInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  length?: number;
  autoFocus?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function OtpInput({
  value,
  onChangeText,
  length = 6,
  autoFocus = false,
  disabled = false,
  style,
}: OtpInputProps) {
  const inputRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState(false);

  const digits = Array.from(
    { length },
    (_, index) => value[index] ?? '',
  );

  const activeIndex =
    value.length >= length ? length - 1 : value.length;

  const handleChangeText = (text: string) => {
    const numbersOnly = text.replace(/\D/g, '').slice(0, length);
    onChangeText(numbersOnly);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Verification code input"
      disabled={disabled}
      style={[styles.container, style]}
      onPress={() => inputRef.current?.focus()}
    >
      <TextInput
        ref={inputRef}
        autoFocus={autoFocus}
        value={value}
        editable={!disabled}
        keyboardType="number-pad"
        maxLength={length}
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        caretHidden
        style={styles.hiddenInput}
        onChangeText={handleChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />

      {digits.map((digit, index) => {
        const isActive = isFocused && index === activeIndex;

        return (
          <View
            key={index}
            style={[
              styles.box,
              isActive && styles.boxActive,
              disabled && styles.boxDisabled,
            ]}
          >
            {digit ? (
              <Text style={styles.digit}>{digit}</Text>
            ) : isActive ? (
              <View style={styles.caret} />
            ) : null}
          </View>
        );
      })}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },

  hiddenInput: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
  },

  box: {
    flex: 1,
    maxWidth: 52,
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: colors.neutral[100],
    borderRadius: 12,
    backgroundColor: colors.other.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  boxActive: {
    borderColor: colors.primary[100],
  },

  boxDisabled: {
    backgroundColor: colors.neutral[25],
    opacity: 0.6,
  },

  digit: {
    fontFamily: fontFamily.semiBold,
    fontSize: 22,
    lineHeight: 28,
    color: colors.neutral[900],
  },

  caret: {
    width: 20,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.primary[100],
  },
});