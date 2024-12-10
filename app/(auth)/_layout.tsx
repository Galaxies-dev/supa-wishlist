import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/contexts/auth';
import LoadingScreen from '@/components/LoadingScreen';

export default function AuthLayout() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Redirect to main app if already authenticated
  if (session) {
    return <Redirect href="/(app)" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}
