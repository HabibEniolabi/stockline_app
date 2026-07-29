import { useState, type ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type ViewStyle,
} from 'react-native';

import { AppIcon } from '../icons/AppIcon';
import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';

type TextFieldProps = TextInputProps & {
  label?: string;
  error?: string;
  leftElement?: ReactNode;
  rightElement?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

export function TextField({
  label,
  error,
  leftElement,
  rightElement,
  containerStyle,
  secureTextEntry,
  editable = true,
  onFocus,
  onBlur,
  ...textInputProps
}: TextFieldProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const isPasswordField = Boolean(secureTextEntry);

  return (
    <View style={containerStyle}>
      {label ? <Text style={styles.label}>{label}</Text> : null}

      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
          !editable && styles.inputContainerDisabled,
        ]}
      >
        {leftElement}

        <TextInput
          {...textInputProps}
          editable={editable}
          secureTextEntry={isPasswordField && !passwordVisible}
          placeholderTextColor={colors.neutral[300]}
          selectionColor={colors.primary[100]}
          style={styles.input}
          onFocus={(event) => {
            setIsFocused(true);
            onFocus?.(event);
          }}
          onBlur={(event) => {
            setIsFocused(false);
            onBlur?.(event);
          }}
        />

        {isPasswordField ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={
              passwordVisible ? 'Hide password' : 'Show password'
            }
            hitSlop={12}
            onPress={() => setPasswordVisible((current) => !current)}
          >
            <AppIcon
              name={passwordVisible ? 'visibilityOff' : 'visibility'}
              size={20}
              color={colors.neutral[300]}
            />
          </Pressable>
        ) : (
          rightElement
        )}
      </View>

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 8,
    fontFamily: fontFamily.medium,
    fontSize: 12,
    lineHeight: 18,
    color: colors.neutral[600],
  },

  inputContainer: {
    height: 56,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: colors.neutral[100],
    borderRadius: 14,
    backgroundColor: colors.other.white,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  inputContainerFocused: {
    borderColor: colors.primary[100],
  },

  inputContainerError: {
    borderColor: colors.error.base,
  },

  inputContainerDisabled: {
    backgroundColor: colors.neutral[25],
    opacity: 0.7,
  },

  input: {
    flex: 1,
    height: '100%',
    paddingVertical: 0,
    fontFamily: fontFamily.regular,
    fontSize: 14,
    lineHeight: 20,
    color: colors.neutral[900],
  },

  error: {
    marginTop: 6,
    fontFamily: fontFamily.regular,
    fontSize: 12,
    lineHeight: 18,
    color: colors.error.base,
  },
});