import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as LocalAuthentication from 'expo-local-authentication';

import { BackButton } from '../../components/ui/BackButton';
import { Button } from '../../components/ui/Button';
import { AnimatedFaceIdIcon } from '../../components/animations/AnimatedFaceIdIcon';
import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { getTypography } from '../../theme/typography';
import { AppIcon } from '../../components/icons/AppIcon';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type BiometricMode = 'face' | 'fingerprint' | 'unsupported';

export default function BiometricSetupScreen() {
  const [mode, setMode] = useState<BiometricMode>('unsupported');

  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const [error, setError] = useState('');

  useEffect(() => {
    const detectBiometricType = async () => {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();

        const isEnrolled = await LocalAuthentication.isEnrolledAsync();

        if (!hasHardware || !isEnrolled) {
          setMode('unsupported');
          return;
        }

        const supportedTypes =
          await LocalAuthentication.supportedAuthenticationTypesAsync();

        const supportsFace = supportedTypes.includes(
          LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION,
        );

        const supportsFingerprint = supportedTypes.includes(
          LocalAuthentication.AuthenticationType.FINGERPRINT,
        );

        if (supportsFace) {
          setMode('face');
          return;
        }

        if (supportsFingerprint) {
          setMode('fingerprint');
          return;
        }

        setMode('unsupported');
      } catch {
        setMode('unsupported');
        setError('We could not check biometric authentication.');
      } finally {
        setIsChecking(false);
      }
    };

    detectBiometricType();
  }, []);

  const fingerprintScale = useSharedValue(1);

  useEffect(() => {
    fingerprintScale.value = withRepeat(
      withSequence(
        withTiming(1.08, { duration: 700 }),
        withTiming(1, { duration: 700 }),
      ),
      -1,
      true,
    );
  }, [fingerprintScale]);

  const fingerprintAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: fingerprintScale.value }],
  }));

  const handleAuthenticate = async () => {
    if (mode === 'unsupported' || isAuthenticating) {
      return;
    }

    setError('');
    setIsAuthenticating(true);

    try {
      const result = await LocalAuthentication.authenticateAsync({
        promptMessage:
          mode === 'face' ? 'Set up Face ID' : 'Set up fingerprint',
        cancelLabel: 'Cancel',
        fallbackLabel: 'Use device passcode',
        disableDeviceFallback: false,
      });

      if (!result.success) {
        if (
          result.error !== 'user_cancel' &&
          result.error !== 'system_cancel'
        ) {
          setError('Biometric authentication was not completed.');
        }

        return;
      }

      router.replace('/(tabs)/home');
    } catch {
      setError('Biometric authentication could not be completed.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleContinueWithoutBiometrics = () => {
    router.replace('/(tabs)/home');
  };

  const handleSkip = () => {
    router.replace('/(tabs)/home');
  };

  if (isChecking) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary[100]} />
        </View>
      </SafeAreaView>
    );
  }

  const isFaceId = mode === 'face';
  const isUnsupported = mode === 'unsupported';

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <BackButton onPress={() => router.back()} />

          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Skip biometric setup"
            hitSlop={12}
            style={({ pressed }) => [
              styles.skipButton,
              pressed && styles.skipButtonPressed,
            ]}
            onPress={handleSkip}
          >
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        <View style={styles.content}>
          <View style={styles.iconContainer}>
            {isFaceId ? (
              <AnimatedFaceIdIcon size={72} />
            ) : (
              <Animated.View style={fingerprintAnimatedStyle}>
                <AppIcon
                  name="fingerprint"
                  size={72}
                  color={colors.primary[100]}
                />
              </Animated.View>
            )}
          </View>

          <Text style={styles.title}>
            {isUnsupported
              ? 'Biometrics unavailable'
              : isFaceId
                ? 'Set up Face ID'
                : 'Set up fingerprint'}
          </Text>

          <Text style={styles.description}>
            {isUnsupported
              ? 'No enrolled biometric authentication was found on this device.'
              : isFaceId
                ? 'Enable Face ID authentication on StockWave for fast and secure entry.'
                : 'Use your fingerprint to unlock StockWave quickly and securely.'}
          </Text>

          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>

        <View style={styles.footer}>
          {isUnsupported ? (
            <Button
              title="Continue"
              variant="primary"
              onPress={handleContinueWithoutBiometrics}
            />
          ) : (
            <Button
              title={
                isAuthenticating
                  ? 'Authenticating...'
                  : isFaceId
                    ? 'Scan my face'
                    : 'Use fingerprint'
              }
              variant="primary"
              loading={isAuthenticating}
              onPress={handleAuthenticate}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.other.white,
  },

  container: {
    flex: 1,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
    paddingBottom: spacing[4],
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[4],
  },

  iconContainer: {
    width: 96,
    height: 96,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[6],
  },

  title: {
    ...getTypography('heading6', 'bold'),
    color: colors.neutral[900],
    textAlign: 'center',
  },

  description: {
    ...getTypography('bodyMedium'),
    maxWidth: 300,
    marginTop: spacing[3],
    color: colors.neutral[500],
    textAlign: 'center',
  },

  error: {
    ...getTypography('bodySmall'),
    marginTop: spacing[4],
    color: colors.error.base,
    textAlign: 'center',
  },

  footer: {
    width: '100%',
  },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  skipButton: {
    minHeight: 48,
    justifyContent: 'center',
    paddingHorizontal: spacing[2],
  },

  skipButtonPressed: {
    opacity: 0.6,
  },

  skipText: {
    ...getTypography('bodyLarge', 'semiBold'),
    color: colors.primary[100],
  },
});
