import * as React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';

export default function ThemesScreen() {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewInner}>
        <Text style={styles.title}>Themes coming soon :)</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'black'
  },
  scrollViewInner: {
    padding: 12,
    alignItems: 'center',
  },
  title: {
    color: '#567',
    fontSize: 20,
    marginTop: 32,
    // fontWeight: 'bold',
  }
});
