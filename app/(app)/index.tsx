import { View, Text, TouchableOpacity, FlatList, RefreshControl } from 'react-native';
import { useEffect, useState } from 'react';
import { Link, useRouter } from 'expo-router';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/contexts/auth';
import { Ionicons } from '@expo/vector-icons';

interface Wishlist {
  id: number;
  name: string;
  created_at: string;
}

export default function HomePage() {
  const router = useRouter();
  const { session } = useAuth();
  const [wishlists, setWishlists] = useState<Wishlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchWishlists() {
    try {
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('wishlists')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;

      setWishlists(data || []);
    } catch (error) {
      console.error('Error fetching wishlists:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchWishlists();
  }, [session]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWishlists();
  };

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={wishlists}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        renderItem={({ item }) => (
          <TouchableOpacity
            className="mx-4 mb-2 rounded-lg bg-white p-4 shadow-sm"
            onPress={() => router.push(`/(app)/${item.id}`)}>
            <Text className="text-lg font-semibold">{item.name}</Text>
            <Text className="text-sm text-gray-500">
              Created {new Date(item.created_at).toLocaleDateString()}
            </Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={() => (
          <View className="flex-1 items-center justify-center p-4">
            <Text className="mb-4 text-center text-gray-500">
              {loading ? 'Loading wishlists...' : 'No wishlists yet'}
            </Text>
            {!loading && (
              <Link href="/(app)/create" asChild>
                <TouchableOpacity className="rounded-lg bg-blue-500 px-6 py-3">
                  <Text className="font-semibold text-white">Create Your First Wishlist</Text>
                </TouchableOpacity>
              </Link>
            )}
          </View>
        )}
      />

      {wishlists.length > 0 && (
        <Link href="/(app)/create" asChild>
          <TouchableOpacity className="absolute bottom-8 right-8 h-14 w-14 items-center justify-center rounded-full bg-blue-500 shadow-lg">
            <Ionicons name="add" size={30} color="white" />
          </TouchableOpacity>
        </Link>
      )}

      <Link href="/(app)/settings" asChild>
        <TouchableOpacity className="absolute right-4 top-4">
          <Ionicons name="settings-outline" size={24} color="#4b5563" />
        </TouchableOpacity>
      </Link>
    </View>
  );
}
