import { useRef, useState } from 'react';
import {
  FlatList,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
  Image,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { getTypography } from '../theme/typography';
import { ImageSourcePropType } from 'react-native';
import { Button } from '../components/ui/Button';
import { router } from 'expo-router';

type WalkthroughSlide = {
  id: string;
  image: ImageSourcePropType;
  title: string;
  description: string;
};

const slides: WalkthroughSlide[] = [
  {
    id: 'stock-trading',
    title: 'Stock trading suite',
    image: require('../assets/images/TradeView1.png'),
    description: 'Streamline your investment decisions\nwith expert guidance.',
  },
  {
    id: 'boost-profits',
    title: 'Boost your profits',
    image: require('../assets/images/TradeView2.png'),
    description: 'Unlocking profit potential for financial\ngrowth.',
  },
];

export default function WalkthroughScreen() {
  const { width } = useWindowDimensions();
  const listRef = useRef<FlatList<WalkthroughSlide>>(null);

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleScrollEnd = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / width);

    setCurrentIndex(nextIndex);
  };

   const handleSkip = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Pressable
          accessibilityRole="button"
          hitSlop={12}
          onPress={handleSkip}
        >
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      </View>
      <FlatList
        ref={listRef}
        data={slides}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        onMomentumScrollEnd={handleScrollEnd}
        getItemLayout={(_, index) => ({
          length: width,
          offset: width * index,
          index,
        })}
        renderItem={({ item }) => (
          <View style={[styles.slide, { width }]}>
            <Image source={item.image} style={styles.image} resizeMode="contain"/>
            <Text style={styles.title}>{item.title}</Text>

            <Text style={styles.description}>{item.description}</Text>
          </View>
        )}
      />

      <WalkthroughProgress currentIndex={currentIndex} total={slides.length} />
      <View style={styles.buttonContainer}>
        <Button
          title={'Sign in'}
          variant="outline"
          fullWidth={false}
          style={styles.actionButton}
          onPress={() => {
            router.push('/(auth)/sign-in');
          }}
        />
        <Button
          title={'Sign up'}
          variant="primary"
          style={styles.actionButton}
          onPress={() => {
            router.push('/(auth)/sign-up');
          }}
        />
      </View>
    </SafeAreaView>
  );
}

type WalkthroughProgressProps = {
  currentIndex: number;
  total: number;
};

function WalkthroughProgress({
  currentIndex,
  total,
}: WalkthroughProgressProps) {
  const trackWidth = 44;
  const indicatorWidth = trackWidth / total;

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityValue={{
        min: 1,
        max: total,
        now: currentIndex + 1,
      }}
      style={[
        styles.progressTrack,
        {
          width: trackWidth,
        },
      ]}
    >
      <View
        style={[
          styles.progressIndicator,
          {
            width: indicatorWidth,
            left: indicatorWidth * currentIndex,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.other.white,
  },

   header: {
    alignItems: 'flex-end',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[2],
  },

  skipText: {
    ...getTypography('bodyMedium', 'semiBold'),
    color: colors.primary[100],
  },

  slide: {
    alignItems: 'center',
    paddingHorizontal: spacing[2],
    paddingTop: spacing[10],
  },

  image: {
    width: 253,
    height: 326,
  },

  title: {
    ...getTypography('heading2', 'bold'),
    color: colors.neutral[900],
    textAlign: 'center',
  },

  description: {
    ...getTypography('bodyMedium'),
    maxWidth: 300,
    marginTop: spacing[3],
    color: colors.neutral[500],
    textAlign: 'center',
  },

  progressTrack: {
    position: 'absolute',
    bottom: spacing[6],
    alignSelf: 'center',
    height: 5,
    overflow: 'hidden',
    borderRadius: 999,
    backgroundColor: colors.neutral[50],
  },

  progressIndicator: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    borderRadius: 999,
    backgroundColor: colors.primary[100],
  },

  buttonContainer: {
    flexDirection: 'row',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingTop: spacing[6],
    paddingBottom: spacing[4],
  },

  actionButton: {
    flex: 1,
  },
});
