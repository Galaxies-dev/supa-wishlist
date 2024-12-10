import { View, Text, TouchableOpacity, ScrollView, Linking, Alert } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { supabase } from '@/supabase/client';

interface WishlistItem {
  id: number;
  name: string;
  url: string | null;
  description: string | null;
}

interface Wishlist {
  id: number;
  name: string;
  created_at: string;
  user: {
    username: string;
  } | null;
}

export default function SharedWishlistPage() {
  const { id } = useLocalSearchParams();
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlistDetails();
  }, [id]);

  async function fetchWishlistDetails() {
    try {
      console.log('fetching wishlist details: ', id);

      // Fetch wishlist details with user info
      const { data: wishlistData, error: wishlistError } = await supabase
        .from('wishlists')
        .select('*, user:users(username)')
        .eq('id', id)
        .single();

      if (wishlistError) throw wishlistError;
      console.log(wishlistData);

      setWishlist(wishlistData);

      // Fetch wishlist items
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('*')
        .eq('wishlist_id', id)
        .order('created_at', { ascending: true });

      if (itemsError) throw itemsError;
      setItems(itemsData || []);
    } catch (error) {
      console.error('Error fetching wishlist details:', error);
      Alert.alert('Error', 'Failed to load wishlist details');
    } finally {
      setLoading(false);
    }
  }

  async function handleOpenUrl(url: string) {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this URL');
      }
    } catch (error) {
      console.error('Error opening URL:', error);
      Alert.alert('Error', 'Failed to open URL');
    }
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Loading wishlist...</Text>
      </View>
    );
  }

  if (!wishlist) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Wishlist not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50">
      <ScrollView className="flex-1 p-4">
        <View className="mb-6">
          <Text className="text-2xl font-bold">{wishlist.name}</Text>
          <Text className="text-gray-500">
            By {wishlist.user?.username || 'Unknown User'} • Created{' '}
            {new Date(wishlist.created_at).toLocaleDateString()}
          </Text>
        </View>

        <View className="space-y-4">
          {items.map((item) => (
            <View key={item.id} className="rounded-lg bg-white p-4 shadow-sm">
              <Text className="text-lg font-semibold">{item.name}</Text>
              {item.description && <Text className="mt-1 text-gray-600">{item.description}</Text>}
              {item.url && (
                <TouchableOpacity className="mt-2" onPress={() => handleOpenUrl(item.url!)}>
                  <Text className="text-blue-500">{item.url}</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}

          {items.length === 0 && (
            <Text className="text-center text-gray-500">No items in this wishlist</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}
