import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { AppIcon } from '../icons/AppIcon';
import { TextField } from './TextField';
import { colors } from '../../theme/colors';

type PhoneNumberFieldProps = {
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
};

export function PhoneNumberField({
  value,
  onChangeText,
  error,
  containerStyle,
}: PhoneNumberFieldProps) {
  const [countryCode] = useState('+1');

  const handleCountryPress = () => {
    // Open your country-selection modal later.
    console.log('Open country selector');
  };

  const handlePhoneChange = (text: string) => {
    // Allow only numbers.
    const numbersOnly = text.replace(/\D/g, '');

    onChangeText(numbersOnly);
  };

  return (
    <TextField
      value={value}
      error={error}
      containerStyle={containerStyle}
      placeholder={`${countryCode}-000-000-0000`}
      keyboardType="phone-pad"
      textContentType="telephoneNumber"
      autoComplete="tel"
      returnKeyType="done"
      maxLength={15}
      onChangeText={handlePhoneChange}
      leftElement={
        <View style={styles.leftElement}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Select country"
            hitSlop={8}
            style={({ pressed }) => [
              styles.countryButton,
              pressed && styles.countryButtonPressed,
            ]}
            onPress={handleCountryPress}
          >
            <Text style={styles.flag}>🇺🇸</Text>

            <AppIcon
              name="chevronDown"
              size={16}
              color={colors.neutral[700]}
            />
          </Pressable>

          <View style={styles.divider} />
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  leftElement: {
    height: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },

  countryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  countryButtonPressed: {
    opacity: 0.6,
  },

  flag: {
    fontSize: 20,
  },

  divider: {
    width: 1,
    height: 24,
    backgroundColor: colors.neutral[100],
  },
});