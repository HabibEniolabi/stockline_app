import { View, Text, StyleSheet } from 'react-native'
import type { ReactNode } from 'react'
import { spacing } from '../../theme/spacing';
import { getTypography } from '../../theme/typography';
import { colors } from '../../theme/colors';

interface AppHeaderProps {
  icon?: ReactNode,
  title: string,
  description: string,
}

const AuthHeader = ({icon, title, description}: AppHeaderProps) => {
  return (
    <View style={styles.context}>
      {icon ? <View style={styles.icon}>{icon}</View> : null}
      <View style={styles.textContainer}>
        <Text style={styles.title}>{title}</Text> 
        {/* {/* <Text style={{fontFamily: 'Inter-Bold', fontSize: 20}}>{title}</Text> */}
        <Text style={styles.description}>{description}</Text>
      </View>
    </View>
  )
}

export default AuthHeader;

const styles = StyleSheet.create({
  context: {
    gap: spacing[4],
    justifyContent: "flex-start"
  },

  icon: {
    width: 40,
    height: 40
  },

  textContainer: {
    gap: spacing[2]
  },

  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    lineHeight: 40,
    color: colors.neutral[900],
  },

  description: {
    fontFamily: 'Inter-Regular',
    fontSize: 14,
    lineHeight: 20,
    color: colors.neutral[500],
  },
})