import { Stack } from 'expo-router';

export default function WishlistLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f8fafc',
        },
        headerShadowVisible: false,
        headerTitle: 'Shared Wishlist',
      }}
    />
  );
}
