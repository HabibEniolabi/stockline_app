import {
  Text,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { spacing } from '../../theme/spacing';
import { colors } from '../../theme/colors';
import AuthHeader from '../../components/common/AuthHeader';
import StockWave from '../../assets/icons/StockWave';
import { TextField } from '../../components/form/TextField';
import { useState } from 'react';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../components/ui/Button';

export default function SignUpScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [username, setUsername] = useState('');
  const [usernameError, setUsernameError] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const handleContinue = () => {
    const normalizedUsername = username.trim();
    const normalizedEmail = email.trim().toLowerCase();

    setUsernameError('');
    setEmailError('');
    setPasswordError('');

    if (!normalizedUsername) {
      setUsernameError('Username is required.');
      return;
    }

    if (normalizedUsername.length < 3) {
      setUsernameError('Username must be at least 3 characters.');
      return;
    }

    if (!/^[a-zA-Z0-9_]+$/.test(normalizedUsername)) {
      setUsernameError(
        'Username can only contain letters, numbers and underscores.',
      );
      return;
    }

    if (!normalizedEmail) {
      setEmailError('Email address is required.');
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(normalizedEmail)) {
      setEmailError('Enter a valid email address.');
      return;
    }

    if (!password) {
      setPasswordError('Password is required.');
      return;
    }

    if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters.');
      return;
    }

    console.log({
      username: normalizedUsername,
      email: normalizedEmail,
      password,
    });

    router.push('/');
  };

  const formIsComplete = !email.trim() || !password || !username.trim();
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <AuthHeader
          icon={<StockWave width={32} height={32} />}
          title="Join StockWave!"
          description="Embark on your investment journey with a\nsingle dollar."
        />

        <View style={styles.form}>
          <TextField
            placeholder="Enter your username"
            value={username}
            error={usernameError}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="username"
            textContentType="username"
            returnKeyType="next"
            onChangeText={(value) => {
              setUsername(value);

              if (usernameError) {
                setUsernameError('');
              }
            }}
          />
          <TextField
            placeholder="Email"
            value={email}
            error={emailError}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="email"
            textContentType="emailAddress"
            returnKeyType="next"
            onChangeText={(value) => {
              setEmail(value);

              if (emailError) {
                setEmailError('');
              }
            }}
          />
          <TextField
            placeholder="Enter your password"
            value={password}
            error={passwordError}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete="new-password"
            textContentType="newPassword"
            onSubmitEditing={handleContinue}
            returnKeyType="done"
            onChangeText={(value) => {
              setPassword(value);

              if (passwordError) {
                setPasswordError('');
              }
            }}
          />

          <Button
            title="Continue"
            onPress={handleContinue}
            disabled={formIsComplete}
            variant="primary"
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },

  container: {
    flex: 1,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[6],
  },

  form: {
    gap: spacing[4],
    marginTop: spacing[8],
    marginBottom: spacing[6],
  },
});
