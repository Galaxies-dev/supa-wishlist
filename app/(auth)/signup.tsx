import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { supabase } from '@/supabase/client';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSignup() {
    try {
      setLoading(true);
      setError(null);

      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      // Create user profile in the users table
      if (authData.user) {
        const { error: profileError } = await supabase.from('users').insert({
          id: authData.user.id,
          email,
          username,
        });

        if (profileError) throw profileError;
      }

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
        <Text className="mb-8 text-center text-2xl font-bold">Create Account</Text>

        {error && <Text className="mb-4 text-center text-red-500">{error}</Text>}

        <TextInput
          className="w-full rounded-lg border border-gray-300 p-4"
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          autoCapitalize="none"
        />

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
          onPress={handleSignup}
          disabled={loading}>
          <Text className="text-center font-semibold text-white">
            {loading ? 'Creating account...' : 'Sign Up'}
          </Text>
        </TouchableOpacity>

        <View className="flex-row justify-center space-x-1">
          <Text className="text-gray-600">Already have an account?</Text>
          <Link href="/login" className="text-blue-500">
            Log in
          </Link>
        </View>
      </View>
    </View>
  );
}
