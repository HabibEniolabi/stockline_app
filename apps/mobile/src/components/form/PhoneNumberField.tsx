import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors } from '../../theme/colors';
import { fontFamily } from '../../theme/typography';
import { CountryPicker } from './CountryPicker';
import type { Country } from '../../components/types/countries';
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
  const handlePhoneChange = (text: string) => {
    const numbersOnly = text.replace(/\D/g, '');

    onChangeText(numbersOnly);
  };

  return (
    <TextField
      value={value}
      error={error}
      containerStyle={containerStyle}
      placeholder="000-000-0000"
      keyboardType="phone-pad"
      textContentType="telephoneNumber"
      autoComplete="tel"
      returnKeyType="done"
      maxLength={15}
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