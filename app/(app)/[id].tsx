import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Share,
  Alert,
  Linking,
  Modal,
  TextInput,
} from 'react-native';
import { useEffect, useState } from 'react';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/contexts/auth';
import { Ionicons } from '@expo/vector-icons';

const EXPO_PUBLIC_SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL;

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

interface NewItem {
  name: string;
  url: string;
  description: string;
}

export default function WishlistDetailsPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { session } = useAuth();
  const [wishlist, setWishlist] = useState<Wishlist | null>(null);
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newItem, setNewItem] = useState<NewItem>({
    name: '',
    url: '',
    description: '',
  });

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

  async function handleSharePublicLink() {
    try {
      const publicUrl = `${EXPO_PUBLIC_SUPABASE_URL}/functions/v1/list?id=${id}`;
      await Share.share({
        message: `Check out my wishlist: ${publicUrl}`,
        url: publicUrl,
      });
    } catch (error) {
      console.error('Error sharing public link:', error);
      Alert.alert('Error', 'Failed to share public link');
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

  async function handleAddItem() {
    try {
      if (!newItem.name.trim()) {
        Alert.alert('Error', 'Item name is required');
        return;
      }

      const { data, error } = await supabase.from('items').insert({
        wishlist_id: Number(id),
        name: newItem.name.trim(),
        url: newItem.url.trim() || null,
        description: newItem.description.trim() || null,
      });

      if (error) throw error;

      // Refresh the items list
      fetchWishlistDetails();
      setIsModalVisible(false);
      setNewItem({ name: '', url: '', description: '' });
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'Failed to add item');
    }
  }

  async function handleDeleteItem(itemId: number) {
    try {
      Alert.alert('Delete Item', 'Are you sure you want to delete this item?', [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const { error } = await supabase.from('items').delete().eq('id', itemId);

            if (error) throw error;
            // Refresh the items list
            fetchWishlistDetails();
          },
        },
      ]);
    } catch (error) {
      console.error('Error deleting item:', error);
      Alert.alert('Error', 'Failed to delete item');
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
            <View key={item.id} className="mb-4 rounded-lg bg-white p-4 shadow-sm">
              <View className="flex-row items-start justify-between">
                <View className="flex-1">
                  <Text className="text-lg font-semibold">{item.name}</Text>
                  {item.description && (
                    <Text className="mt-1 text-gray-600">{item.description}</Text>
                  )}
                  {item.url && (
                    <TouchableOpacity className="mt-2" onPress={() => handleOpenUrl(item.url!)}>
                      <Text className="text-blue-500">{item.url}</Text>
                    </TouchableOpacity>
                  )}
                </View>
                <TouchableOpacity className="p-2" onPress={() => handleDeleteItem(item.id)}>
                  <Ionicons name="trash-outline" size={20} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          ))}

          {items.length === 0 && (
            <Text className="text-center text-gray-500">No items in this wishlist</Text>
          )}
        </View>
      </ScrollView>

      <View className="absolute bottom-8 right-8 flex-row gap-2">
        <TouchableOpacity
          className="h-14 w-14 items-center justify-center rounded-full bg-red-500 shadow-lg"
          onPress={handleDeleteWishlist}>
          <Ionicons name="trash-outline" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          className="h-14 w-14 items-center justify-center rounded-full bg-green-500 shadow-lg"
          onPress={() => setIsModalVisible(true)}>
          <Ionicons name="add-outline" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          className="h-14 w-14 items-center justify-center rounded-full bg-purple-500 shadow-lg"
          onPress={handleSharePublicLink}>
          <Ionicons name="globe-outline" size={24} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          className="h-14 w-14 items-center justify-center rounded-full bg-blue-500 shadow-lg"
          onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}>
        <View className="flex-1 justify-end">
          <View className="rounded-t-3xl bg-white p-4 shadow-lg">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-xl font-bold">Add New Item</Text>
              <TouchableOpacity onPress={() => setIsModalVisible(false)}>
                <Ionicons name="close-outline" size={24} color="black" />
              </TouchableOpacity>
            </View>

            <TextInput
              className="mb-4 rounded-lg bg-gray-100 p-3"
              placeholder="Item name *"
              value={newItem.name}
              onChangeText={(text) => setNewItem((prev) => ({ ...prev, name: text }))}
            />

            <TextInput
              className="mb-4 rounded-lg bg-gray-100 p-3"
              placeholder="URL (optional)"
              value={newItem.url}
              onChangeText={(text) => setNewItem((prev) => ({ ...prev, url: text }))}
              keyboardType="url"
            />

            <TextInput
              className="mb-4 rounded-lg bg-gray-100 p-3"
              placeholder="Description (optional)"
              value={newItem.description}
              onChangeText={(text) => setNewItem((prev) => ({ ...prev, description: text }))}
              multiline
              numberOfLines={3}
            />

            <TouchableOpacity className="rounded-lg bg-blue-500 p-4" onPress={handleAddItem}>
              <Text className="text-center font-semibold text-white">Add Item</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
