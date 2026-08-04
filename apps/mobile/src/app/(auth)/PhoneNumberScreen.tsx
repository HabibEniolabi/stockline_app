import { router } from 'expo-router';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BackButton } from '../../components/ui/BackButton';
import AuthHeader from '../../components/common/AuthHeader';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { Button } from '../../components/ui/Button';
import { useState } from 'react';

import { countries } from '../../components/types/countries';
import { PhoneNumberField } from '../../components/form/PhoneNumberField';

export default function PhoneNumberScreen() {
  const [country, setCountry] = useState(
    countries.find((item) => item.iso2 === 'US') ?? countries[0],
  );

  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');

  const handleSendCode = () => {
    setPhoneError('');

    if (!phoneNumber) {
      setPhoneError('Phone number is required.');
      return;
    }

    if (phoneNumber.length < 7) {
      setPhoneError('Enter a valid phone number.');
      return;
    }

    const internationalPhoneNumber = `${country.dialCode}${phoneNumber}`;

    console.log({
      country: country.name,
      countryCode: country.iso2,
      dialCode: country.dialCode,
      phoneNumber: internationalPhoneNumber,
    });

    router.push('/(auth)/OtpVerificationScreen');
  };
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.keyboardView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <BackButton
            onPress={() => {
              router.back();
            }}
          />

          <View style={styles.headerContainer}>
            <AuthHeader
              title="Enter your phone number"
              description={
                "You'll receive a 5 digit code for the\nphone number verification"
              }
            />
            <PhoneNumberField
              country={country}
              value={phoneNumber}
              error={phoneError}
              onCountryChange={(selectedCountry) => {
                setCountry(selectedCountry);
                setPhoneNumber('');
                setPhoneError('');
              }}
              onChangeText={(value) => {
                setPhoneNumber(value);

                if (phoneError) {
                  setPhoneError('');
                }
              }}
            />
          </View>

          <View style={styles.footer}>
            <Button
              title={'Send code'}
              onPress={handleSendCode}
              variant="primary"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.other.white,
  },

  keyboardView: {
    flex: 1,
  },

  content: {
    flexGrow: 1,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
    paddingBottom: spacing[4],
  },

  headerContainer: {
    marginTop: spacing[12],
  },

  footer: {
    paddingHorizontal: spacing[4],
    paddingBottom: spacing[4],
    gap: spacing[10],
  },
});
