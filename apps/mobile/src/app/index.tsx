import { View, StyleSheet } from 'react-native';
import { router } from 'expo-router';

import { getTypography } from '../theme/typography';
import { colors } from '../theme/colors';
import { AnimatedStockWaveLogo } from '../components/branding/AnimatedStockWaveLogo';

export default function Index() {

  const handleAnimationFinished = () => {
    router.replace('/walkthroughScreen');
  }
  return (
    <View style={styles.container}>
      <AnimatedStockWaveLogo 
        size={48}
        onAnimationFinished={handleAnimationFinished}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.other.white,
  },
  brand: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  brandName: {
    ...getTypography('heading2', 'bold'),
    color: colors.neutral[900],
  },
});
