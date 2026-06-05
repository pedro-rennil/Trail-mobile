import type { PropsWithChildren, ReactNode } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';

type TrailScreenProps = PropsWithChildren<{
  footer?: ReactNode;
}>;

export function TrailScreen({ children, footer }: TrailScreenProps) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {children}
        {footer ? <View style={styles.footer}>{footer}</View> : null}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#07111f',
  },
  container: {
    flex: 1,
    backgroundColor: '#07111f',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  footer: {
    marginTop: 20,
  },
});