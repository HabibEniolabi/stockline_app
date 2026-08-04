import { Pressable, StyleSheet } from 'react-native';

import { AppIcon } from '../icons/AppIcon';
import { colors } from '../../theme/colors';

type BackButtonProps = {
  onPress: () => void;
};

export function BackButton({
  onPress,
}: BackButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Go back"
      hitSlop={12}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.buttonPressed,
      ]}
    >
      <AppIcon
        name="chevronLeft"
        size={24}
        color={colors.neutral[700]}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 48,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.neutral[100],
    borderRadius: 16,
    backgroundColor: colors.other.white,
  },

  buttonPressed: {
    opacity: 0.6,
  },
});