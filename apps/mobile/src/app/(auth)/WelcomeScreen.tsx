import { router } from 'expo-router';
import { StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SuccessInfo } from '../../components/common/SuccessInfo';
import { Button } from '../../components/ui/Button';
import { AnimatedStockWaveLogo } from
  '../../components/branding/AnimatedStockWaveLogo';
import { colors } from '../../theme/colors';
import { getTypography } from '../../theme/typography';

export default function WelcomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <SuccessInfo
        icon={
          <AnimatedStockWaveLogo size={96} />
        }
        title={
          <Text style={styles.title}>
           {" Hello Agatha Bella! 👋\nWelcome to StockWave"}
          </Text>
        }
        description="It’s great to have you here"
        footer={
          <Button
            title="I’m ready to start!"
            variant="primary"
            onPress={() => {
              router.replace('/(tabs)/home');
            }}
          />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.other.white,
  },

  title: {
    ...getTypography('heading4', 'bold'),
    color: colors.neutral[900],
    textAlign: 'center',
  },
});