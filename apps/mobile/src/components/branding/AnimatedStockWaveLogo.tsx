import { useCallback, useEffect, useRef, useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  Easing,
  cancelAnimation,
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors } from '../../theme/colors';
import { getTypography } from '../../theme/typography';

/* -------------------------------------------------------------------------- */
/* Geometry                                                                    */
/* -------------------------------------------------------------------------- */

/**
 * Lifted verbatim from assets/icons/StockWave so the splash mark and the static
 * icon can never drift apart. Everything stays in the icon's own 40x40 viewBox
 * and is scaled at render time.
 */
const VIEW_BOX = 40;
const FRAME_PATH = 'M0 40V0h40v40H0ZM4.762 4.762h30.476v30.476H4.762V4.762Z';
const FRAME_STROKE = 4.762;
const INNER_INSET = FRAME_STROKE / VIEW_BOX; // 0.119
const INNER_SIZE = (VIEW_BOX - FRAME_STROKE * 2) / VIEW_BOX; // 0.762

/**
 * Every bar sits at exactly 45deg, so a bar moving along its own axis reads the
 * way a rain streak does: it travels lengthwise, not sideways. Starting each one
 * off the top-right and running it down-left is therefore literal rainfall —
 * slanted, accelerating, landing.
 *
 * `travel` is the per-axis distance (viewBox units) needed to park the bar fully
 * outside the frame's inner square before it drops.
 * `delay` / `duration` are deliberately uneven — evenly spaced drops read as a
 * machine, not weather.
 */
const BARS = [
  {
    d: 'M19.303 11.684l-8.096 8.095-3.367-3.367 8.095-8.096 3.368 3.367Z',
    travel: 16,
    delay: 40,
    duration: 460,
  },
  {
    d: 'm11.207 32.16 20.476-20.476-3.367-3.368L7.84 28.793l3.367 3.367Z',
    travel: 25,
    delay: 150,
    duration: 500,
  },
  {
    d: 'M23.588 32.16l8.095-8.095-3.367-3.368-8.095 8.096 3.367 3.367Z',
    travel: 16,
    delay: 210,
    duration: 430,
  },
];

/* -------------------------------------------------------------------------- */
/* Timeline                                                                    */
/* -------------------------------------------------------------------------- */

const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const GRAVITY = Easing.in(Easing.quad); // slow release, fast landing

const T = {
  markIn: 520,
  impactAt: 90, // after markIn — the frame flinches as the long bar lands
  impactUp: 90,
  impactDown: 240,
  settle: 220, // the small recoil after each bar hits
  lockupAt: 820,
  lockupIn: 520,
  wordmarkFade: 320,
  hold: 900,
};

const TOTAL = T.lockupAt + T.lockupIn + T.hold;
const REDUCED_TOTAL = 600;

const RECOIL = 0.035; // of `size`, per axis
const IMPACT_SCALE = 1.02;
const GAP = 12;
const WORDMARK_OFFSET = 14;

/* -------------------------------------------------------------------------- */
/* Bar                                                                         */
/* -------------------------------------------------------------------------- */

type RainBarProps = {
  d: string;
  travel: number;
  delay: number;
  duration: number;
  size: number;
  reduceMotion: boolean;
  color: string;
};

function RainBar({ d, travel, delay, duration, size, reduceMotion, color }: RainBarProps) {
  // Positive offset = parked up-and-right of its resting slot.
  const offset = useSharedValue(reduceMotion ? 0 : (travel / VIEW_BOX) * size);

  useEffect(() => {
    if (reduceMotion) {
      offset.value = 0;
      return;
    }

    offset.value = withDelay(
      delay,
      withSequence(
        // fall, accelerating, a hair past the resting slot
        withTiming(-size * RECOIL, { duration, easing: GRAVITY }),
        // and rebound into place
        withTiming(0, { duration: T.settle, easing: EASE_OUT }),
      ),
    );

    return () => cancelAnimation(offset);
  }, [delay, duration, offset, reduceMotion, size]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }, { translateY: -offset.value }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          left: -size * INNER_INSET,
          top: -size * INNER_INSET,
          width: size,
          height: size,
        },
        animatedStyle,
      ]}
    >
      <Svg width={size} height={size} viewBox={`0 0 ${VIEW_BOX} ${VIEW_BOX}`} fill="none">
        <Path d={d} fill={color} />
      </Svg>
    </Animated.View>
  );
}

/* -------------------------------------------------------------------------- */
/* Logo                                                                        */
/* -------------------------------------------------------------------------- */

type AnimatedStockWaveLogoProps = {
  size?: number;
  wordmark?: string;
  color?: string;
  onAnimationFinished?: () => void;
};

export function AnimatedStockWaveLogo({
  size = 48,
  wordmark = 'StockWave',
  color = colors.primary[100],
  onAnimationFinished,
}: AnimatedStockWaveLogoProps) {
  const reduceMotion = useReducedMotion();

  // Measured once so the lockup can start optically centred on the mark alone
  // and settle into the centre of the full lockup as the wordmark arrives.
  const [wordmarkWidth, setWordmarkWidth] = useState<number | null>(null);

  const rootOpacity = useSharedValue(0);
  const shift = useSharedValue(0);
  const markScale = useSharedValue(0.88);
  const wordmarkOpacity = useSharedValue(0);
  const wordmarkX = useSharedValue(WORDMARK_OFFSET);
  const completion = useSharedValue(0);

  const hasFinished = useRef(false);

  const handleFinished = useCallback(() => {
    if (hasFinished.current) return;
    hasFinished.current = true;
    onAnimationFinished?.();
  }, [onAnimationFinished]);

  const handleWordmarkLayout = useCallback((event: LayoutChangeEvent) => {
    const { width } = event.nativeEvent.layout;
    if (width > 0) setWordmarkWidth((current) => current ?? width);
  }, []);

  useEffect(() => {
    if (wordmarkWidth === null) return;

    // Start centred on the mark alone, then glide left as the wordmark lands.
    shift.value = (wordmarkWidth + GAP) / 2;

    if (reduceMotion) {
      rootOpacity.value = withTiming(1, { duration: 200 });
      shift.value = 0;
      markScale.value = 1;
      wordmarkOpacity.value = withTiming(1, { duration: 200 });
      wordmarkX.value = 0;
    } else {
      rootOpacity.value = withTiming(1, { duration: 220, easing: EASE_OUT });

      markScale.value = withSequence(
        withTiming(1, { duration: T.markIn, easing: EASE_OUT }),
        withDelay(T.impactAt, withTiming(IMPACT_SCALE, { duration: T.impactUp })),
        withTiming(1, { duration: T.impactDown, easing: EASE_OUT }),
      );

      shift.value = withDelay(
        T.lockupAt,
        withTiming(0, { duration: T.lockupIn, easing: EASE_OUT }),
      );
      wordmarkOpacity.value = withDelay(
        T.lockupAt,
        withTiming(1, { duration: T.wordmarkFade, easing: EASE_OUT }),
      );
      wordmarkX.value = withDelay(
        T.lockupAt,
        withTiming(0, { duration: T.lockupIn, easing: EASE_OUT }),
      );
    }

    completion.value = withDelay(
      reduceMotion ? REDUCED_TOTAL : TOTAL,
      withTiming(1, { duration: 1 }, (finished) => {
        'worklet';
        if (finished) runOnJS(handleFinished)();
      }),
    );

    return () => {
      cancelAnimation(rootOpacity);
      cancelAnimation(shift);
      cancelAnimation(markScale);
      cancelAnimation(wordmarkOpacity);
      cancelAnimation(wordmarkX);
      cancelAnimation(completion);
    };
  }, [
    completion,
    handleFinished,
    markScale,
    reduceMotion,
    rootOpacity,
    shift,
    wordmarkOpacity,
    wordmarkWidth,
    wordmarkX,
  ]);

  const rootStyle = useAnimatedStyle(() => ({
    opacity: rootOpacity.value,
    transform: [{ translateX: shift.value }],
  }));

  const markStyle = useAnimatedStyle(() => ({
    transform: [{ scale: markScale.value }],
  }));

  const wordmarkStyle = useAnimatedStyle(() => ({
    opacity: wordmarkOpacity.value,
    transform: [{ translateX: wordmarkX.value }],
  }));

  const innerOffset = size * INNER_INSET;
  const innerSize = size * INNER_SIZE;

  return (
    <Animated.View style={[styles.container, rootStyle]}>
      <Animated.View style={[{ width: size, height: size }, markStyle]}>
        <Svg
          width={size}
          height={size}
          viewBox={`0 0 ${VIEW_BOX} ${VIEW_BOX}`}
          fill="none"
          style={StyleSheet.absoluteFill}
        >
          <Path d={FRAME_PATH} fill={color} fillRule="evenodd" clipRule="evenodd" />
        </Svg>

        {/* Clipped to the frame's inner square, so the bars only ever exist
            inside the mark. No opacity fade — they arrive by falling. */}
        <View
          style={{
            position: 'absolute',
            left: innerOffset,
            top: innerOffset,
            width: innerSize,
            height: innerSize,
            overflow: 'hidden',
          }}
        >
          {BARS.map((bar) => (
            <RainBar
              key={bar.d}
              d={bar.d}
              travel={bar.travel}
              delay={bar.delay}
              duration={bar.duration}
              size={size}
              reduceMotion={reduceMotion}
              color={color}
            />
          ))}
        </View>
      </Animated.View>

      <Animated.Text
        numberOfLines={1}
        onLayout={handleWordmarkLayout}
        style={[styles.wordmark, wordmarkStyle]}
      >
        {wordmark}
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: GAP,
  },

  wordmark: {
    ...getTypography('heading3', 'bold'),
    color: colors.neutral[900],
  },
});