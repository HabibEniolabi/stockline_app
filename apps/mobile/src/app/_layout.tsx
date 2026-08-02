import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

const Layout = () => {
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
          name="onboarding"
          options={{
            animation: 'fade',
          }}
        />
      </Stack>
    </>
  );
};

export default Layout;
