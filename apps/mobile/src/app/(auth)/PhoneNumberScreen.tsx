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

const handleSendCode = () => {
  router.push('/(auth)/verification-two');
}

export default function PhoneNumberScreen() {
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
                "You'll receive a 4 digit code for the\nphone number verification"
              }
            />
          </View>

          {/* Phone-number field and Continue button */}
          <View style={styles.footer}>
            <Button title={'Send code'} onPress={handleSendCode} variant='primary' />
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