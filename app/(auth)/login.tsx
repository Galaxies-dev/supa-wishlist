import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { supabase } from '@/supabase/client';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin() {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      router.replace('/(app)');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 justify-center bg-white p-4">
      <View className="space-y-4">
        <Text className="mb-8 text-center text-2xl font-bold">Welcome Back</Text>

        {error && <Text className="mb-4 text-center text-red-500">{error}</Text>}

        <TextInput
          className="w-full rounded-lg border border-gray-300 p-4"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TextInput
          className="w-full rounded-lg border border-gray-300 p-4"
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          className={`w-full rounded-lg p-4 ${loading ? 'bg-gray-400' : 'bg-blue-500'}`}
          onPress={handleLogin}
          disabled={loading}>
          <Text className="text-center font-semibold text-white">
            {loading ? 'Logging in...' : 'Login'}
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center space-x-1">
          <Text className="text-gray-600">Don't have an account?</Text>
          <Link href="/signup" className="text-blue-500">
            Sign up
          </Link>
        </View>

        <Link href="/forgot-password" className="text-center text-blue-500">
          Forgot Password?
        </Link>
      </View>
    </View>
  );
}
