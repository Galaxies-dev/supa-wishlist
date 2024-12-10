import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { useState, useEffect } from 'react';
import { router } from 'expo-router';
import { supabase } from '@/supabase/client';
import { useAuth } from '@/contexts/auth';

interface UserProfile {
  username: string;
  email: string;
}

export default function SettingsPage() {
  const { session } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [username, setUsername] = useState('');

  useEffect(() => {
    fetchProfile();
  }, [session]);

  async function fetchProfile() {
    try {
      if (!session?.user) return;

      const { data, error } = await supabase
        .from('users')
        .select('username, email')
        .eq('id', session.user.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setUsername(data.username);
    } catch (error) {
      console.error('Error fetching profile:', error);
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  }

  async function handleUpdateProfile() {
    try {
      if (!session?.user) return;
      if (!username.trim()) {
        Alert.alert('Error', 'Username cannot be empty');
        return;
      }

      setUpdating(true);

      const { error } = await supabase.from('users').update({ username }).eq('id', session.user.id);

      if (error) throw error;

      Alert.alert('Success', 'Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      Alert.alert('Error', 'Failed to update profile');
    } finally {
      setUpdating(false);
    }
  }

  async function handleLogout() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      router.replace('/(auth)/login');
    } catch (error) {
      console.error('Error signing out:', error);
      Alert.alert('Error', 'Failed to sign out');
    }
  }

  async function handleDeleteAccount() {
    Alert.alert(
      'Delete Account',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              if (!session?.user) return;

              // Delete user data
              const { error: dataError } = await supabase
                .from('users')
                .delete()
                .eq('id', session.user.id);

              if (dataError) throw dataError;

              // Sign out
              const { error: authError } = await supabase.auth.signOut();
              if (authError) throw authError;

              router.replace('/(auth)/login');
            } catch (error) {
              console.error('Error deleting account:', error);
              Alert.alert('Error', 'Failed to delete account');
            }
          },
        },
      ]
    );
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-gray-500">Loading profile...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-50 p-4">
      <View className="space-y-4">
        <View>
          <Text className="mb-2 font-semibold text-gray-700">Username</Text>
          <TextInput
            className="w-full rounded-lg border border-gray-200 bg-white p-4"
            value={username}
            onChangeText={setUsername}
            placeholder="Enter username"
          />
        </View>

        <View>
          <Text className="mb-2 font-semibold text-gray-700">Email</Text>
          <Text className="w-full rounded-lg border border-gray-200 bg-gray-100 p-4 text-gray-500">
            {profile?.email}
          </Text>
        </View>

        <TouchableOpacity
          className={`mt-4 w-full rounded-lg p-4 ${updating ? 'bg-gray-400' : 'bg-blue-500'}`}
          onPress={handleUpdateProfile}
          disabled={updating}>
          <Text className="text-center font-semibold text-white">
            {updating ? 'Updating...' : 'Update Profile'}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-4 w-full rounded-lg border border-gray-300 bg-white p-4"
          onPress={handleLogout}>
          <Text className="text-center font-semibold text-gray-700">Log Out</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="mt-4 w-full rounded-lg bg-red-500 p-4"
          onPress={handleDeleteAccount}>
          <Text className="text-center font-semibold text-white">Delete Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
