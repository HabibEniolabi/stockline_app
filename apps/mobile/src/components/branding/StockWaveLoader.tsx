import { useEffect } from 'react';
import { StyleSheet, View, type ViewStyle } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import Animated, {
  Easing,
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
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

const FALL_IN = 620; // arriving — decelerates into place
const RESOLVE = 320; // the beat where the mark is the real logo
const FALL_OUT = 620; // leaving — accelerates away

/**
 * Every bar shares one cycle but travels its own distance, so all three pass
 * through zero at the same instant and the complete mark resolves once per
 * loop. The longer bar therefore moves faster, which is also how longer rain
 * streaks behave — the physics and the brand agree by accident.
 */
const CYCLE = FALL_IN + RESOLVE + FALL_OUT;

const PULSE_IN = 900;
const PULSE_OUT = 900;

/* -------------------------------------------------------------------------- */
/* Bar                                                                         */
/* -------------------------------------------------------------------------- */

type StreamBarProps = {
  d: string;
  travel: number;
  size: number;
  color: string;
};

function StreamBar({ d, travel, size, color }: StreamBarProps) {
  // Positive offset = parked up-and-right of the resting slot.
  const start = (travel / VIEW_BOX) * size;
  const offset = useSharedValue(start);

  useEffect(() => {
    offset.value = withRepeat(
      withSequence(
        // snap back to the top of the run — invisible, the bar is outside the clip
        withTiming(start, { duration: 1 }),
        withTiming(0, { duration: FALL_IN, easing: EASE_OUT }),
        // hold: this is the frame where the loader IS the logo
        withDelay(RESOLVE, withTiming(-start, { duration: FALL_OUT, easing: GRAVITY })),
      ),
      -1,
      false,
    );

    return () => cancelAnimation(offset);
  }, [offset, start]);

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
/* Loader                                                                      */
/* -------------------------------------------------------------------------- */

type StockWaveLoaderProps = {
  size?: number;
  color?: string;
  style?: ViewStyle;
  /** Announced to screen readers while the loader is on screen. */
  label?: string;
};

export function StockWaveLoader({
  size = 40,
  color = colors.primary[100],
  style,
  label = 'Loading',
}: StockWaveLoaderProps) {
  const reduceMotion = useReducedMotion();

  // Reduced motion gets an opacity breath instead of movement — still clearly
  // "working", no translation.
  const pulse = useSharedValue(1);

  useEffect(() => {
    if (!reduceMotion) return;

    pulse.value = withRepeat(
      withSequence(
        withTiming(0.35, { duration: PULSE_OUT, easing: Easing.inOut(Easing.quad) }),
        withTiming(1, { duration: PULSE_IN, easing: Easing.inOut(Easing.quad) }),
      ),
      -1,
      false,
    );

    return () => cancelAnimation(pulse);
  }, [pulse, reduceMotion]);

  const pulseStyle = useAnimatedStyle(() => ({ opacity: pulse.value }));

  const innerOffset = size * INNER_INSET;
  const innerSize = size * INNER_SIZE;

  return (
    <Animated.View
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      style={[{ width: size, height: size }, pulseStyle, style]}
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
        {reduceMotion
          ? BARS.map((bar) => (
              <View
                key={bar.id}
                pointerEvents="none"
                style={{
                  position: 'absolute',
                  left: -innerOffset,
                  top: -innerOffset,
                  width: size,
                  height: size,
                }}
              >
                <Svg
                  width={size}
                  height={size}
                  viewBox={`0 0 ${VIEW_BOX} ${VIEW_BOX}`}
                  fill="none"
                >
                  <Path d={bar.d} fill={color} />
                </Svg>
              </View>
            ))
          : BARS.map((bar) => (
              <StreamBar
                key={bar.id}
                d={bar.d}
                travel={bar.travel}
                size={size}
                color={color}
              />
            ))}
      </View>
    </Animated.View>
  );
}

export { CYCLE as STOCKWAVE_LOADER_CYCLE };