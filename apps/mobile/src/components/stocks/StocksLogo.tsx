import { useEffect, useState } from 'react';
import {
  StyleSheet,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { Image } from 'expo-image';

import { colors } from '../../theme/colors';

const stockPlaceholder = require('../../assets/images/stock-placeholder.png');

type StockLogoProps = {
  logoUrl?: string | null;
  symbol?: string;
  companyName?: string;
  size?: number;
  borderRadius?: number;
  padding?: number;
  style?: StyleProp<ViewStyle>;
};

export function StockLogo({
  logoUrl,
  symbol,
  companyName,
  size = 40,
  borderRadius = size / 2,
  padding = 8,
  style,
}: StockLogoProps) {
  const [hasImageError, setHasImageError] = useState(false);

  useEffect(() => {
    setHasImageError(false);
  }, [logoUrl]);

  const shouldShowPlaceholder = !logoUrl || hasImageError;

  const accessibilityLabel = shouldShowPlaceholder
    ? `${companyName ?? symbol ?? 'Stock'} placeholder logo`
    : `${companyName ?? symbol ?? 'Stock'} logo`;

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
          borderRadius,
          padding,
        },
        style,
      ]}
    >
      <Image
        source={
          shouldShowPlaceholder
            ? stockPlaceholder
            : {
                uri: logoUrl,
              }
        }
        accessibilityLabel={accessibilityLabel}
        style={styles.image}
        contentFit="contain"
        cachePolicy="memory-disk"
        transition={150}
        recyclingKey={logoUrl ?? 'stock-placeholder'}
        onError={() => setHasImageError(true)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    backgroundColor: colors.neutral[25],
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.neutral[50],
  },

  image: {
    width: '100%',
    height: '100%',
  },
});