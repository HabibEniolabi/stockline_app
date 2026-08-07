import { useEffect, useRef, useState } from 'react';
import {
  Animated,
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

export type OtpStatus = 'default' | 'error' | 'success';

type OtpInputProps = {
  value: string;
  onChangeText: (value: string) => void;
  length?: number;
  autoFocus?: boolean;
  disabled?: boolean;
  status?: OtpStatus;
  shakeTrigger?: number;
  style?: StyleProp<ViewStyle>;
};

export function OtpInput({
  value,
  onChangeText,
  length = 6,
  autoFocus = false,
  disabled = false,
  status = 'default',
  shakeTrigger = 0,
  style,
}: OtpInputProps) {
  const inputRef = useRef<TextInput>(null);
  const translateX = useRef(new Animated.Value(0)).current;

  const [isFocused, setIsFocused] = useState(false);

  const digits = Array.from({ length }, (_, index) => value[index] ?? '');

  const activeIndex = value.length >= length ? length - 1 : value.length;

  useEffect(() => {
    if ((status !== 'error' && status !== 'success') || shakeTrigger === 0) {
      return;
    }

    translateX.setValue(0);

    const distance = status === 'error' ? 10 : 4;
    const duration = status === 'error' ? 50 : 80;

    Animated.sequence([
      Animated.timing(translateX, {
        toValue: -distance,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: distance,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: -(distance * 0.6),
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: distance * 0.6,
        duration,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: 0,
        duration,
        useNativeDriver: true,
      }),
    ]).start();
  }, [shakeTrigger, status, translateX]);

  const handleChangeText = (text: string) => {
    const numbersOnly = text.replace(/\D/g, '').slice(0, length);
    onChangeText(numbersOnly);
  };

  const handlePress = () => {
    if (!disabled) {
      inputRef.current?.focus();
    }
  };

  return (
    <Animated.View
      style={[
        styles.animatedContainer,
        {
          transform: [{ translateX }],
        },
      ]}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Verification code input"
        disabled={disabled}
        style={[styles.container, style]}
        onPress={handlePress}
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
          importantForAutofill="yes"
          caretHidden
          style={styles.hiddenInput}
          onChangeText={handleChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />

        {digits.map((digit, index) => {
          const isActive =
            isFocused && index === activeIndex && status === 'default';

          return (
            <View
              key={index}
              style={[
                styles.box,
                isActive && styles.boxActive,
                status === 'error' && styles.boxError,
                status === 'success' && styles.boxSuccess,
                disabled && styles.boxDisabled,
              ]}
            >
              {digit ? (
                <Text
                  style={[
                    styles.digit,
                    status === 'error' && styles.digitError,
                    status === 'success' && styles.digitSuccess,
                  ]}
                >
                  {digit}
                </Text>
              ) : isActive ? (
                <View style={styles.caret} />
              ) : null}
            </View>
          );
        })}
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  animatedContainer: {
    width: '100%',
  },

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
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.neutral[100],
    borderRadius: 12,
    backgroundColor: colors.other.white,
  },

  boxActive: {
    borderColor: colors.primary[100],
  },

  boxError: {
    borderColor: colors.error.base,
    backgroundColor: '#FFF5F5',
  },

  boxSuccess: {
    borderColor: colors.success.base,
    backgroundColor: '#F2FFF8',
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

  digitError: {
    color: colors.error.base,
  },

  digitSuccess: {
    color: colors.success.base,
  },

  caret: {
    width: 20,
    height: 2,
    borderRadius: 1,
    backgroundColor: colors.primary[100],
  },
});
