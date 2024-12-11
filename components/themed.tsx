import { Text as RNText, View as RNView, TextInput as RNTextInput, Pressable } from 'react-native';
import {
  type TextInputProps,
  type ViewProps,
  type TextProps,
  type PressableProps,
} from 'react-native';

interface ButtonProps extends PressableProps {
  children: React.ReactNode;
}

export function Text({ className = '', ...props }: TextProps & { className?: string }) {
  return <RNText className={`text-gray-800 dark:text-gray-200 ${className}`} {...props} />;
}

export function View({ className = '', ...props }: ViewProps & { className?: string }) {
  return <RNView className={`dark:bg-dark-500 bg-white ${className}`} {...props} />;
}

export function TextInput({ className = '', ...props }: TextInputProps & { className?: string }) {
  return (
    <RNTextInput
      className={`dark:bg-dark-300 rounded-lg bg-gray-100 px-4 py-2 text-gray-800 dark:text-gray-100 ${className}`}
      placeholderTextColor={props.placeholderTextColor ?? '#6c757d'}
      {...props}
    />
  );
}

export function Button({
  className = '',
  children,
  ...props
}: ButtonProps & { className?: string }) {
  return (
    <Pressable
      className={`bg-brand-500 dark:bg-brand-400 flex-row items-center justify-center rounded-lg px-4 py-3 active:opacity-80 ${className}`}
      {...props}>
      {typeof children === 'string' ? (
        <Text className="text-center font-semibold text-white">{children}</Text>
      ) : (
        children
      )}
    </Pressable>
  );
}
