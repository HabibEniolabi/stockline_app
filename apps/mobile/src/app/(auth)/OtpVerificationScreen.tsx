import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import AuthHeader from '../../components/common/AuthHeader';
import { OtpInput } from '../../components/form/OtpInput';
import { BackButton } from '../../components/ui/BackButton';
import { Button } from '../../components/ui/Button';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { getTypography } from '../../theme/typography';

const OTP_LENGTH = 5;

export default function VerificationTwoScreen() {
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');

  const handleVerifyCode = () => {
    setError('');

    if (verificationCode.length !== OTP_LENGTH) {
      setError(`Enter the ${OTP_LENGTH}-digit verification code.`);
      return;
    }

    console.log({
      verificationCode,
    });

    // Replace this with your verification API request later.
    router.replace('/(tabs)/home');
  };

  const handleCodeChange = (value: string) => {
    setVerificationCode(value);

    if (error) {
      setError('');
    }
  };

  const handleResendCode = () => {
    setVerificationCode('');
    setError('');

    console.log('Resend verification code');
  };

  const codeIsIncomplete =
    verificationCode.length !== OTP_LENGTH;

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
          <BackButton onPress={() => router.back()} />

          <View style={styles.mainContent}>
            <AuthHeader
              title="Enter verification code"
              description={
                'We have sent the verification code to your\nmobile number'
              }
            />

            <View style={styles.otpSection}>
              <OtpInput
                value={verificationCode}
                onChangeText={handleCodeChange}
                length={OTP_LENGTH}
                autoFocus
              />

              {error ? (
                <Text style={styles.errorText}>
                  {error}
                </Text>
              ) : null}

              <View style={styles.resendContainer}>
                <Text style={styles.resendQuestion}>
                  Didn&apos;t receive the code?
                </Text>

                <Pressable
                  accessibilityRole="button"
                  hitSlop={8}
                  onPress={handleResendCode}
                >
                  <Text style={styles.resendText}>
                    Resend code
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <Button
              title="Verify account"
              variant="primary"
              disabled={codeIsIncomplete}
              onPress={handleVerifyCode}
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

  mainContent: {
    marginTop: spacing[12],
  },

  otpSection: {
    marginTop: spacing[8],
  },

  errorText: {
    ...getTypography('bodySmall'),
    marginTop: spacing[2],
    color: colors.error.base,
  },

  resendContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[1],
    marginTop: spacing[6],
  },

  resendQuestion: {
    ...getTypography('bodyMedium'),
    color: colors.neutral[500],
  },

  resendText: {
    ...getTypography('bodyMedium', 'semiBold'),
    color: colors.primary[100],
  },

  footer: {
    marginTop: 'auto',
    paddingTop: spacing[8],
  },
});