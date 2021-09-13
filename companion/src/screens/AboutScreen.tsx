import * as React from 'react';
import { StyleSheet, View, Text, Linking } from 'react-native';
import { Heart } from '../Icon';

export default function AboutScreen() {
  return (
    <View style={styles.container}>
      <Heart width={96} colorPrimary='#ff91f7' colorSecondary='#542459'/>
      <Text style={styles.title}>Like Focus?</Text>
      <Text style={styles.description}>Check out my other projects on my{' '}
        <Text style={styles.link} onPress={() => Linking.openURL('https://aurail.us/discord')}>Discord</Text>.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center'
  },
  description: {
    color: '#789',
    marginBottom: 36
  },
  title: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 12
  },
  link: {
    color: '#c46abd',
    fontWeight: '700'
  }
});
