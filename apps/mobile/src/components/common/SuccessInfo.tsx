import type { ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { getTypography } from '../../theme/typography';

type SuccessInfoProps = {
  icon: ReactNode;
  title: ReactNode;
  description?: string;
  confetti?: ReactNode;
  footer?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function SuccessInfo({
  icon,
  title,
  description,
  confetti,
  footer,
  style,
}: SuccessInfoProps) {
  return (
    <View style={[styles.container, style]}>
      {confetti ? (
        <View
          pointerEvents="none"
          style={StyleSheet.absoluteFill}
        >
          {confetti}
        </View>
      ) : null}

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          {icon}
        </View>

        <View style={styles.textContainer}>
          {typeof title === 'string' ? (
            <Text style={styles.title}>
              {title}
            </Text>
          ) : (
            title
          )}

          {description ? (
            <Text style={styles.description}>
              {description}
            </Text>
          ) : null}
        </View>
      </View>

      {footer ? (
        <View style={styles.footer}>
          {footer}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.other.white,
    paddingHorizontal: spacing[4],
    paddingTop: spacing[8],
    paddingBottom: spacing[4],
  },

  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[10],
  },

  textContainer: {
    alignItems: 'center',
  },

  title: {
    ...getTypography('heading4', 'bold'),
    color: colors.neutral[900],
    textAlign: 'center',
  },

  description: {
    ...getTypography('bodyLarge'),
    marginTop: spacing[4],
    color: colors.neutral[500],
    textAlign: 'center',
  },

  footer: {
    width: '100%',
    paddingTop: spacing[6],
  },
});