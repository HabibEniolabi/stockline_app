import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { SuccessInfo } from './SuccessInfo';
import { StockWaveSuccessMark } from
  '../branding/StockWaveSuccessMark';
import { ConfettiAnimation } from
  '../animations/ConfettiAnimation';
import { colors } from '../../theme/colors';

export default function OrderSuccessScreen() {
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace('/(tabs)/orders');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.safeArea}>
      <SuccessInfo
        icon={
          <StockWaveSuccessMark />
        }
        confetti={
          <ConfettiAnimation />
        }
        title="Order successful!"
        description="Your order has been placed successfully."
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.other.white,
  },
});