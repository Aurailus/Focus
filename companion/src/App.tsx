import React, { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, Image, StyleSheet, } from 'react-native';

import Navigation from './Navigation';

export default function App() {
  return (
    <SafeAreaProvider style={{ backgroundColor: '#0c1014' }}>
      <StatusBar style='light'/>
      <View style={styles.top}>
        <View style={styles.topImageWrap}>
          <Image source={require('../assets/images/watch.png')} style={styles.topImage}/>
        </View>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>Focus Watchface</Text>
          <Text style={styles.subtitle}>Companion App</Text>
        </View>
      </View>
      {/* <View style={{ borderRadius: 12, flexGrow: 1, overflow: 'hidden' }}> */}
      <Navigation/>
      {/* </View> */}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  titleWrap: {
    padding: 24,
    justifyContent: 'center'
  },
  title: {
    color: '#cde',
    fontSize: 22,
  },
  subtitle: {
    color: '#789',
    fontSize: 18
  },
  top: {
    paddingLeft: 16,
    paddingTop: 48,
    paddingBottom: 16,
    flexDirection: 'row'
  },
  topImageWrap: {
    borderRadius: 9999,
    backgroundColor: '#181f24',
    padding: 4,
    flexGrow: 0
  },
  topImage: {
    width: 128,
    height: 128,
    borderRadius: 9999
  }
});
