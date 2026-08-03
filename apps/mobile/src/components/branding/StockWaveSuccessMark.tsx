import { useCallback, useEffect, useRef } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
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
import { BARS, FRAME_PATH, INNER_INSET, INNER_SIZE, VIEW_BOX } from '../types/stockWaveGeometry';

/* -------------------------------------------------------------------------- */
/* Timeline                                                                    */
/* -------------------------------------------------------------------------- */

const EASE_OUT = Easing.bezier(0.16, 1, 0.3, 1);
const GRAVITY = Easing.in(Easing.quad);

/**
 * Deliberately uneven — three bars landing on a metronome reads as a machine
 * finishing a job. Slight variance reads as something arriving.
 */
const FALLS = [
  { delay: 0, duration: 460 },
  { delay: 110, duration: 500 },
  { delay: 170, duration: 430 },
];

const LAST_LANDING = 600; // max(delay + duration), rounded
const SETTLE = 220; // recoil after impact
const FRAME_IN = 240;
const IMPACT_UP = 90;
const IMPACT_DOWN = 260;

const SETTLED_AT = LAST_LANDING + SETTLE;
const REDUCED_SETTLED_AT = 240;

const RECOIL = 0.035; // of `size`, per axis
const IMPACT_SCALE = 1.03;

/* -------------------------------------------------------------------------- */
/* Bar                                                                         */
/* -------------------------------------------------------------------------- */

type LockingBarProps = {
  d: string;
  travel: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  reduceMotion: boolean;
};

function LockingBar({
  d,
  travel,
  delay,
  duration,
  size,
  color,
  reduceMotion,
}: LockingBarProps) {
  // Positive offset = still up-and-right of the resting slot, i.e. in flight.
  const offset = useSharedValue(reduceMotion ? 0 : (travel / VIEW_BOX) * size);

  useEffect(() => {
    if (reduceMotion) {
      offset.value = 0;
      return;
    }

    offset.value = withDelay(
      delay,
      withSequence(
        withTiming(-size * RECOIL, { duration, easing: GRAVITY }),
        withTiming(0, { duration: SETTLE, easing: EASE_OUT }),
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
/* Success mark                                                                */
/* -------------------------------------------------------------------------- */

type StockWaveSuccessMarkProps = {
  size?: number;
  color?: string;
  style?: ViewStyle;
  /**
   * Fires the instant the mark locks. Hang the haptic and the receipt reveal
   * off this so the whole screen lands on one beat.
   */
  onSettled?: () => void;
  /** Announced to screen readers. Say what happened, not what it looks like. */
  label?: string;
};

export function StockWaveSuccessMark({
  size = 72,
  color = colors.primary[100],
  style,
  onSettled,
  label = 'Order placed',
}: StockWaveSuccessMarkProps) {
  const reduceMotion = useReducedMotion();

  const frameOpacity = useSharedValue(0);
  const markScale = useSharedValue(0.9);
  const completion = useSharedValue(0);

  const hasSettled = useRef(false);

  const handleSettled = useCallback(() => {
    if (hasSettled.current) return;
    hasSettled.current = true;
    onSettled?.();
  }, [onSettled]);

  useEffect(() => {
    if (reduceMotion) {
      frameOpacity.value = withTiming(1, { duration: 180 });
      markScale.value = 1;
    } else {
      frameOpacity.value = withTiming(1, { duration: FRAME_IN, easing: EASE_OUT });

      markScale.value = withSequence(
        withTiming(1, { duration: FRAME_IN, easing: EASE_OUT }),
        // the frame takes the hit as the last bar lands, then holds still
        withDelay(LAST_LANDING - FRAME_IN, withTiming(IMPACT_SCALE, { duration: IMPACT_UP })),
        withTiming(1, { duration: IMPACT_DOWN, easing: EASE_OUT }),
      );
    }

    completion.value = withDelay(
      reduceMotion ? REDUCED_SETTLED_AT : SETTLED_AT,
      withTiming(1, { duration: 1 }, (finished) => {
        'worklet';
        if (finished) runOnJS(handleSettled)();
      }),
    );

    return () => {
      cancelAnimation(frameOpacity);
      cancelAnimation(markScale);
      cancelAnimation(completion);
    };
  }, [completion, frameOpacity, handleSettled, markScale, reduceMotion]);

  const markStyle = useAnimatedStyle(() => ({
    opacity: frameOpacity.value,
    transform: [{ scale: markScale.value }],
  }));

  const innerOffset = size * INNER_INSET;
  const innerSize = size * INNER_SIZE;

  return (
    <Animated.View
      accessible
      accessibilityRole="image"
      accessibilityLabel={label}
      style={[{ width: size, height: size }, markStyle, style]}
    >
      <Svg
        width={size}
        height={size}
        viewBox={`0 0 ${VIEW_BOX} ${VIEW_BOX}`}
        fill="none"
        style={StyleSheet.absoluteFill}
      >
        <Path d={FRAME_PATH} fill={color} fillRule="evenodd" clipRule="evenodd" />
      </Svg>

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
        {BARS.map((bar, index) => (
          <LockingBar
            key={bar.id}
            d={bar.d}
            travel={bar.travel}
            delay={FALLS[index].delay}
            duration={FALLS[index].duration}
            size={size}
            color={color}
            reduceMotion={reduceMotion}
          />
        ))}
      </View>
    </Animated.View>
  );
}

export { SETTLED_AT as STOCKWAVE_SUCCESS_SETTLED_AT };