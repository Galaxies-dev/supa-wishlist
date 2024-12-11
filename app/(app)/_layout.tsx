import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/contexts/auth';
import LoadingScreen from '@/components/LoadingScreen';
import { TouchableOpacity, Text } from 'react-native';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function AppLayout() {
  const { session, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  // Redirect to auth if not authenticated
  if (!session) {
    return <Redirect href="/(auth)/login" />;
  }

  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#f8fafc',
        },
        headerShadowVisible: false,
      }}>
      <Stack.Screen
        name="index"
        options={{
          title: 'My Wishlists',
          headerRight: () => (
            <Link href="/(app)/settings" asChild>
              <TouchableOpacity className="">
                <Ionicons name="settings-outline" size={24} color="#4b5563" />
              </TouchableOpacity>
            </Link>
          ),
        }}
      />
      <Stack.Screen
        name="create"
        options={{
          title: 'Create Wishlist',
          presentation: 'modal',
        }}
      />
      <Stack.Screen
        name="[id]"
        options={{
          title: 'Wishlist Details',
        }}
      />
      <Stack.Screen
        name="settings"
        options={{
          title: 'Settings',
        }}
      />
    </Stack>
  );
}
