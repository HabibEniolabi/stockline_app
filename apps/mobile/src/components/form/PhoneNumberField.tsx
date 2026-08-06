import { useMemo } from 'react';
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import {
  AsYouType,
  getExampleNumber,
} from 'libphonenumber-js/max';
import mobileExamples from 'libphonenumber-js/examples.mobile.json';

import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { CountryPicker } from './CountryPicker';
import { TextField } from './TextField';
import type { Country } from '../types/countries';

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
  const phoneDetails = useMemo(() => {
    const exampleNumber = getExampleNumber(
      country.iso2,
      mobileExamples,
    );

    const placeholder =
      exampleNumber?.formatNational() ?? '000 000 0000';

    const maximumDigits =
      exampleNumber?.nationalNumber.length ?? 15;

    return {
      placeholder,
      maximumDigits,
    };
  }, [country.iso2]);

  const formattedValue = useMemo(() => {
    if (!value) {
      return '';
    }

    return new AsYouType(country.iso2).input(value);
  }, [country.iso2, value]);

  const handlePhoneChange = (text: string) => {
    const digitsOnly = text
      .replace(/\D/g, '')
      .slice(0, phoneDetails.maximumDigits);

    onChangeText(digitsOnly);
  };

  return (
    <TextField
      value={formattedValue}
      error={error}
      containerStyle={containerStyle}
      placeholder={phoneDetails.placeholder}
      keyboardType="phone-pad"
      textContentType="telephoneNumber"
      autoComplete="tel"
      returnKeyType="done"
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