import * as React from 'react';
import { StyleSheet, View, ScrollView, Text } from 'react-native';

import { Field, Label, Color, Select, Switch } from '../field';

const NOTCH_SELECT_DATA = [
  { label: 'None', value: 'none' },
  { label: 'Quarter', value: 'quarter' },
  { label: 'Hour', value: 'hour' },
  { label: 'Minute', value: 'minute' }
];

export default function ThemesScreen() {
  const [ notches, setNotches ] = React.useState<string>('none');
  const [ notchesAmbient, setNotchesAmbient ] = React.useState<string>('none');
  const [ showEvents, setShowEvents ] = React.useState<boolean>(false);
  const [ showMinutes, setShowMinutes ] = React.useState<boolean>(false);
  const [ showGlow, setShowGlow ] = React.useState<boolean>(false);
  const [ glowColorA, setGlowColorA ] = React.useState<string>('#006fff');
  const [ glowColorB, setGlowColorB ] = React.useState<string>('#00aeff');
  const [ glowColorC, setGlowColorC ] = React.useState<string>('#d500ff');

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollViewInner}>
        <View style={{ flexDirection: 'row' }}>
          <View style={{ flex: 1, marginRight: 12 }}>
            <Select label='Notches' value={notches} onSelect={setNotches} data={NOTCH_SELECT_DATA}/>
          </View>
          <View style={{ flex: 1 }}>
            <Select label='Notches - Ambient Mode'
              value={notchesAmbient} onSelect={setNotches} data={NOTCH_SELECT_DATA}/>
          </View>
        </View>
        <Label text='Elements'/>
        <Field>
          <Switch pressableStyle={{ paddingVertical: 16 }} background={false} label='Show Events'
            value={showEvents} onValue={() => setShowEvents(!showEvents)}/>
          <Switch pressableStyle={{ paddingVertical: 16 }} background={false} label='Show Minutes Hand'
            value={showMinutes} onValue={() => setShowMinutes(!showMinutes)}/>
        </Field>
        <Label text='Colors'/>
        <Field>
          <Color background={false} label='Accent Color'
            value={glowColorA} onValue={setGlowColorA}/>
          <Switch pressableStyle={{ paddingVertical: 16 }} background={false} label='Background Glow'
            value={showGlow} onValue={() => setShowGlow(!showGlow)}/>
          <View style={[{ paddingLeft: 20, paddingRight: 20, paddingTop: 8, paddingBottom: 12,
            flexDirection: 'row', justifyContent: 'center' }, !showGlow && { opacity: 0.5 }]}
            pointerEvents={showGlow ? 'auto' : 'none'}>
            <Color style={{ marginRight: 32, height: 40, minHeight: 40, borderRadius: 4 }}
              background={false} value={glowColorA} onValue={setGlowColorA}/>
            <Color style={{ marginRight: 32, height: 40, minHeight: 40, borderRadius: 4 }}
              background={false} value={glowColorB} onValue={setGlowColorB}/>
            <Color style={{ minHeight: 40, height: 40, borderRadius: 4 }}
              background={false} value={glowColorC} onValue={setGlowColorC}/>
          </View>
        </Field>
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
    padding: 12
  },
  title: {
    color: '#567',
    fontSize: 20,
    marginTop: 32
  }
});
