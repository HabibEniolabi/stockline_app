import { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { AsYouType } from 'libphonenumber-js/max';

import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { CountryPicker } from './CountryPicker';
import type { Country } from '../types/countries';
import { TextField } from './TextField';

type PhoneNumberFieldProps = {
  value: string;
  country: Country;
  error?: string;
  containerStyle?: StyleProp<ViewStyle>;
  onChangeText: (value: string) => void;
  onCountryChange: (country: Country) => void;
};

export function PhoneNumberField({
  value,
  country,
  error,
  containerStyle,
  onChangeText,
  onCountryChange,
}: PhoneNumberFieldProps) {
  const formattedValue = useMemo(() => {
    if (!value) {
      return '';
    }

    return new AsYouType(country.iso2).input(value);
  }, [country.iso2, value]);

  const handlePhoneChange = (text: string) => {
    const digitsOnly = text
      .replace(/\D/g, '')
      .slice(0, 15);

    onChangeText(digitsOnly);
  };

  return (
    <TextField
      value={formattedValue}
      error={error}
      containerStyle={containerStyle}
      placeholder="Phone number"
      keyboardType="phone-pad"
      textContentType="telephoneNumber"
      autoComplete="tel"
      returnKeyType="done"
      maxLength={25}
      onChangeText={handlePhoneChange}
      leftElement={
        <View style={styles.leftElement}>
          <CountryPicker
            selectedCountry={country}
            onSelectCountry={onCountryChange}
          />

          <View style={styles.divider} />

          <Text style={styles.dialCode}>
            {country.dialCode}
          </Text>
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

  divider: {
    width: 1,
    height: 24,
    backgroundColor: colors.neutral[100],
  },

  dialCode: {
    fontFamily: fontFamily.regular,
    fontSize: 14,
    color: colors.neutral[500],
  },
});