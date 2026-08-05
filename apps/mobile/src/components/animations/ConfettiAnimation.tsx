import { useEffect, useMemo, useRef } from 'react';
import {
  Animated,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';

import { colors } from '../../theme/colors';

const CONFETTI_COUNT = 20;

const confettiColors = [
  colors.primary[100],
  colors.success.base,
  colors.warning.base,
  colors.other.pink,
  colors.other.purple,
  colors.other.sky,
  colors.other.orange,
];

type ConfettiAnimationProps = {
  duration?: number;
};

export function ConfettiAnimation({
  duration = 2200,
}: ConfettiAnimationProps) {
  const { width, height } = useWindowDimensions();

  const progressValues = useRef(
    Array.from(
      { length: CONFETTI_COUNT },
      () => new Animated.Value(0),
    ),
  ).current;

  const pieces = useMemo(
    () =>
      Array.from({ length: CONFETTI_COUNT }, (_, index) => ({
        id: index,
        left: Math.random() * Math.max(width - 20, 1),
        delay: Math.random() * 500,
        sway: Math.random() * 80 - 40,
        rotation: 360 + Math.random() * 540,
        size: 5 + Math.random() * 6,
        color:
          confettiColors[
            index % confettiColors.length
          ],
        isCircle: index % 3 === 0,
      })),
    [width],
  );

  useEffect(() => {
    progressValues.forEach((value) => {
      value.setValue(0);
    });

    const animations = progressValues.map(
      (progress, index) =>
        Animated.sequence([
          Animated.delay(pieces[index].delay),
          Animated.timing(progress, {
            toValue: 1,
            duration,
            useNativeDriver: true,
          }),
        ]),
    );

    Animated.parallel(animations).start();

    return () => {
      animations.forEach((animation) => {
        animation.stop();
      });
    };
  }, [duration, pieces, progressValues]);

  return (
    <View
      pointerEvents="none"
      style={StyleSheet.absoluteFill}
    >
      {pieces.map((piece, index) => {
        const progress = progressValues[index];

        const translateY = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [-30, height * 0.75],
        });

        const translateX = progress.interpolate({
          inputRange: [0, 0.5, 1],
          outputRange: [
            0,
            piece.sway,
            piece.sway * -0.4,
          ],
        });

        const rotate = progress.interpolate({
          inputRange: [0, 1],
          outputRange: [
            '0deg',
            `${piece.rotation}deg`,
          ],
        });

        const opacity = progress.interpolate({
          inputRange: [0, 0.08, 0.8, 1],
          outputRange: [0, 1, 1, 0],
        });

        return (
          <Animated.View
            key={piece.id}
            style={[
              styles.piece,
              {
                left: piece.left,
                width: piece.size,
                height: piece.isCircle
                  ? piece.size
                  : piece.size * 1.8,
                borderRadius: piece.isCircle
                  ? piece.size / 2
                  : 2,
                backgroundColor: piece.color,
                opacity,
                transform: [
                  { translateX },
                  { translateY },
                  { rotate },
                ],
              },
            ]}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  piece: {
    position: 'absolute',
    top: 0,
  },
});