import { forwardRef } from 'react';
import { Pressable, StyleSheet, Text, type PressableProps } from 'react-native';
import type { ElementRef } from 'react';

type TrailButtonProps = PressableProps & {
  label: string;
};

export const TrailButton = forwardRef<ElementRef<typeof Pressable>, TrailButtonProps>(function TrailButton(
  { label, style, ...props },
  ref
) {
  return (
    <Pressable
      ref={ref}
      {...props}
      style={({ pressed }) => [styles.button, pressed && styles.buttonPressed, style]}
    >
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
});

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#38bdf8',
    borderRadius: 16,
    minHeight: 52,
    justifyContent: 'center',
    paddingHorizontal: 18,
    paddingVertical: 14,
  },
  buttonPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  label: {
    color: '#07111f',
    fontSize: 16,
    fontWeight: '700',
  },
});