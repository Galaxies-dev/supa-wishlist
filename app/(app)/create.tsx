import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/contexts/auth';
import { Ionicons } from '@expo/vector-icons';

interface WishlistItem {
  name: string;
  url: string;
}

export default function CreateWishlistPage() {
  const { session } = useAuth();
  const [name, setName] = useState('');
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemUrl, setNewItemUrl] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleCreateWishlist() {
    try {
      if (!session?.user) return;
      if (!name.trim()) {
        Alert.alert('Error', 'Please enter a wishlist name');
        return;
      }
      if (items.length === 0) {
        Alert.alert('Error', 'Please add at least one item');
        return;
      }

      setLoading(true);

      // Create wishlist
      const { data: wishlist, error: wishlistError } = await supabase
        .from('wishlists')
        .insert([
          {
            name,
            user_id: session.user.id,
          },
        ])
        .select()
        .single();

      if (wishlistError) throw wishlistError;

      // Add items to wishlist
      const { error: itemsError } = await supabase.from('items').insert(
        items.map((item) => ({
          wishlist_id: wishlist.id,
          name: item.name,
          url: item.url,
        }))
      );

      if (itemsError) throw itemsError;

      router.replace(`/(app)/${wishlist.id}`);
    } catch (error) {
      console.error('Error creating wishlist:', error);
      Alert.alert('Error', 'Failed to create wishlist');
    } finally {
      setLoading(false);
    }
  }

  function handleAddItem() {
    if (!newItemName.trim()) {
      Alert.alert('Error', 'Please enter an item name');
      return;
    }

    setItems([...items, { name: newItemName, url: newItemUrl }]);
    setNewItemName('');
    setNewItemUrl('');
  }

  function handleRemoveItem(index: number) {
    setItems(items.filter((_, i) => i !== index));
  }

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      <View className="space-y-4">
        <View>
          <Text className="mb-2 font-semibold text-gray-700">Wishlist Name</Text>
          <TextInput
            className="w-full rounded-lg border border-gray-200 bg-white p-4"
            placeholder="Enter wishlist name"
            value={name}
            onChangeText={setName}
          />
        </View>

        <View className="rounded-lg border border-gray-200 bg-white p-4">
          <Text className="mb-4 font-semibold text-gray-700">Add Items</Text>

          <View className="space-y-4">
            <TextInput
              className="w-full rounded-lg border border-gray-200 bg-gray-50 p-4"
              placeholder="Item name"
              value={newItemName}
              onChangeText={setNewItemName}
            />

            <TextInput
              className="w-full rounded-lg border border-gray-200 bg-gray-50 p-4"
              placeholder="Product URL (optional)"
              value={newItemUrl}
              onChangeText={setNewItemUrl}
              autoCapitalize="none"
              keyboardType="url"
            />

            <TouchableOpacity className="rounded-lg bg-blue-500 p-4" onPress={handleAddItem}>
              <Text className="text-center font-semibold text-white">Add Item</Text>
            </TouchableOpacity>
          </View>
        </View>

        {items.length > 0 && (
          <View className="rounded-lg border border-gray-200 bg-white p-4">
            <Text className="mb-4 font-semibold text-gray-700">Items</Text>

            {items.map((item, index) => (
              <View
                key={index}
                className="mb-2 flex-row items-center justify-between rounded-lg bg-gray-50 p-4">
                <View>
                  <Text className="font-semibold">{item.name}</Text>
                  {item.url && <Text className="text-sm text-blue-500">{item.url}</Text>}
                </View>
                <TouchableOpacity onPress={() => handleRemoveItem(index)} className="p-2">
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        <TouchableOpacity
          className={`w-full rounded-lg p-4 ${loading ? 'bg-gray-400' : 'bg-blue-500'}`}
          onPress={handleCreateWishlist}
          disabled={loading}>
          <Text className="text-center font-semibold text-white">
            {loading ? 'Creating...' : 'Create Wishlist'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
