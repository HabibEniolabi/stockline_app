import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
} from '@expo-google-fonts/inter';
import { useFonts } from 'expo-font';
import * as Font from "expo-font"

SplashScreen.preventAutoHideAsync();

const Layout = () => {
    const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
    'Inter-ExtraBold': Inter_800ExtraBold,
  });

  useEffect(() => {
    if (fontError) {
      console.error('Font loading error:', fontError);
    }

    if (fontsLoaded) {
      console.log(
        'Inter-Bold loaded:',
        Font.isLoaded('Inter-Bold'),
      );

      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (fontError) {
    throw fontError;
  }

  if (!fontsLoaded) {
    return null;
  }
  return (
    <>
      <StatusBar style="dark" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen
          name="index"
          options={{
            animation: 'fade',
          }}
        />
         <Stack.Screen
          name="walkthroughScreen"
          options={{
            animation: 'fade',
          }}
        />
         <Stack.Screen
          name="(auth)/sign-in"
          options={{
            animation: 'fade',
          }}
        />
         <Stack.Screen
          name="(auth)/sign-up"
          options={{
            animation: 'fade',
          }}
        />
      </Stack>
    </>
  );
};

export default Layout;
