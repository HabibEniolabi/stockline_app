import { useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { colors } from '../../theme/colors';
import { spacing } from '../../theme/spacing';
import { getTypography } from '../../theme/typography';

type OtpPreviewModalProps = {
  visible: boolean;
  length?: number;
  duration?: number;
  onClose: () => void;
  onCodeGenerated: (code: string) => void;
};

const generateOtp = (length: number): string => {
  const minimum = 10 ** (length - 1);
  const maximum = 10 ** length - 1;

  return Math.floor(
    minimum + Math.random() * (maximum - minimum + 1),
  ).toString();
};

export function OtpPreviewModal({
  visible,
  length = 6,
  duration = 6000,
  onClose,
  onCodeGenerated,
}: OtpPreviewModalProps) {
  const [code, setCode] = useState('');

  const progress = useRef(
    new Animated.Value(1),
  ).current;

  const handleModalShow = () => {
    const newCode = generateOtp(length);

    setCode(newCode);
    onCodeGenerated(newCode);

    progress.stopAnimation();
    progress.setValue(1);

    Animated.timing(progress, {
      toValue: 0,
      duration,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) {
        onClose();
      }
    });
  };

  const handleClose = () => {
    progress.stopAnimation();
    onClose();
  };

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      statusBarTranslucent
      onShow={handleModalShow}
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Pressable
          style={StyleSheet.absoluteFill}
          onPress={handleClose}
        />

        <View style={styles.modal}>
          <Text style={styles.label}>
            Your verification code
          </Text>

          <Text style={styles.code}>
            {code}
          </Text>

          <Text style={styles.description}>
            This code will disappear shortly.
          </Text>

          <View style={styles.progressTrack}>
            <Animated.View
              style={[
                styles.progressIndicator,
                {
                  width: progressWidth,
                },
              ]}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[4],
    backgroundColor: 'rgba(13, 13, 18, 0.45)',
  },

  modal: {
    width: '100%',
    maxWidth: 340,
    padding: spacing[6],
    borderRadius: 20,
    backgroundColor: colors.other.white,
  },

  label: {
    ...getTypography('bodyMedium', 'semiBold'),
    color: colors.neutral[900],
    textAlign: 'center',
  },

  code: {
    ...getTypography('heading3', 'bold'),
    marginTop: spacing[4],
    color: colors.primary[100],
    textAlign: 'center',
    letterSpacing: 8,
  },

  description: {
    ...getTypography('bodySmall'),
    marginTop: spacing[3],
    color: colors.neutral[500],
    textAlign: 'center',
  },

  progressTrack: {
    width: '100%',
    height: 4,
    marginTop: spacing[6],
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: colors.neutral[50],
  },

  progressIndicator: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: colors.primary[100],
  },
});