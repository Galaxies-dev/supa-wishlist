import { View, Text, TouchableOpacity, ScrollView, Share, Alert, Linking } from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/contexts/auth';
import { Ionicons } from '@expo/vector-icons';
import { create } from 'zustand';

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
  user_id: string;
}

export default function WishlistDetailsPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { session } = useAuth();
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('DETAILS: ', id);

    fetchWishlistDetails();
  }, []);

  async function fetchWishlistDetails() {
    try {
      console.log(session);

      if (!session?.user) return;

      console.log('fetching wishlist details: ', id);
      // Fetch wishlist details
      const { data: wishlistData, error: wishlistError } = await supabase
        .from('wishlists')
        .select('*')
        .eq('id', id)
        .single();

      if (wishlistError) throw wishlistError;
      setWishlist(wishlistData);

      // Fetch wishlist items
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('*')
        .eq('wishlist_id', id)
        .order('created_at', { ascending: true });

      console.log('itemsData: ', itemsData);
      if (itemsError) throw itemsError;
      setItems(itemsData || []);
    } catch (error) {
      console.error('Error fetching wishlist details:', error);
      Alert.alert('Error', 'Failed to load wishlist details');
    } finally {
      setLoading(false);
    }
  }

  async function handleShare() {
    try {
      const shareUrl = `testapp://wishlist/${id}`;
      await Share.share({
        message: `Check out my wishlist: ${shareUrl}`,
      });
    } catch (error) {
      console.error('Error sharing wishlist:', error);
    }
  }

  async function handleDeleteWishlist() {
    try {
      Alert.alert('Delete Wishlist', 'Are you sure you want to delete this wishlist?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase.from('wishlists').delete().eq('id', id);

            if (error) throw error;
            router.replace('/(app)');
          },
        },
      ]);
    } catch (error) {
      console.error('Error deleting wishlist:', error);
      Alert.alert('Error', 'Failed to delete wishlist');
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
            Created {new Date(wishlist.created_at).toLocaleDateString()}
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

      <View className="absolute bottom-8 right-8 flex-row space-x-4">
        <TouchableOpacity
          className="h-14 w-14 items-center justify-center rounded-full bg-red-500 shadow-lg"
          onPress={handleDeleteWishlist}>
          <Ionicons name="trash-outline" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          className="h-14 w-14 items-center justify-center rounded-full bg-blue-500 shadow-lg"
          onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
