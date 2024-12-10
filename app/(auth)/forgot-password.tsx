import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { Link } from 'expo-router';
import { supabase } from '@/supabase/client';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleResetPassword() {
    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: 'testapp://reset-password',
      });

      if (error) throw error;

      setSuccess(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 justify-center bg-white p-4">
      <View className="space-y-4">
        <Text className="mb-8 text-center text-2xl font-bold">Reset Password</Text>

        {error && <Text className="mb-4 text-center text-red-500">{error}</Text>}

        {success && (
          <Text className="mb-4 text-center text-green-500">
            Password reset instructions have been sent to your email
          </Text>
        )}

        <TextInput
          className="w-full rounded-lg border border-gray-300 p-4"
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />

        <TouchableOpacity
          className={`w-full rounded-lg p-4 ${loading ? 'bg-gray-400' : 'bg-blue-500'}`}
          onPress={handleResetPassword}
          disabled={loading}>
          <Text className="text-center font-semibold text-white">
            {loading ? 'Sending...' : 'Send Reset Instructions'}
          </Text>
        </TouchableOpacity>

        <Link href="/login" className="text-center text-blue-500">
          Back to Login
        </Link>
      </View>
    </View>
  );
}
