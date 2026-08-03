import { Text, View, StyleSheet } from 'react-native';
import { spacing } from '../../theme/spacing';
import { colors } from '../../theme/colors';
import AuthHeader from '../../components/common/AuthHeader';
import StockWave from '../../assets/icons/StockWave';

export default function SignInScreen() {
  return (
   <View style={styles.container}>
      <AuthHeader 
        icon={<StockWave width={32} height={32}/>}
        title="Hi there!👋"
        description='Welcome back, Sign in to your account.'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: spacing[8],
    backgroundColor: colors.other.white,
  }
});