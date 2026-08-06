import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { AppIcon } from '../icons/AppIcon';
import { colors } from '../../theme/colors';

type AnimatedFaceIdIconProps = {
  size?: number;
};

export function AnimatedFaceIdIcon({ size = 72 }: AnimatedFaceIdIconProps) {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0.35);
  const scanY = useSharedValue(-24);

  useEffect(() => {
    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, {
          duration: 700,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: 700,
          easing: Easing.inOut(Easing.ease),
        }),
      ),
      -1,
      true,
    );

    opacity.value = withRepeat(
      withSequence(
        withTiming(0.9, { duration: 700 }),
        withTiming(0.35, { duration: 700 }),
      ),
      -1,
      true,
    );

    scanY.value = withRepeat(
      withTiming(24, {
        duration: 1400,
        easing: Easing.inOut(Easing.linear),
      }),
      -1,
      false,
    );
  }, [opacity, scale, scanY]);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const scanStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: scanY.value }],
  }));

  return (
    <View
      style={[
        styles.container,
        {
          width: size,
          height: size,
        },
      ]}
    >
      <Animated.View style={iconStyle}>
        <AppIcon name="faceId" size={size} color={colors.primary[100]} />
      </Animated.View>

      <Animated.View
        pointerEvents="none"
        style={[
          styles.scanLine,
          {
            width: size * 0.65,
          },
          scanStyle,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },

  scanLine: {
    position: 'absolute',
    height: 2,
    borderRadius: 999,
    backgroundColor: colors.primary[100],
  },
});
