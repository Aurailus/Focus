import * as React from 'react';
import { StyleSheet, View, Text, Switch, FlatList } from 'react-native';

import { Button } from '../field';
import * as Calendars from '../native/Calendars';

interface CalendarItemProps {
  color: string;
  title: string;
  enabled: boolean;
  onSwitch: () => void;
}

function getSwitchColors(enabled: boolean) {
  return {
    background: enabled ? '#c46abd' : '#123',
    foreground: enabled ? '#ffc9fb' : '#789'
  };
}

function CalendarItem(props: CalendarItemProps) {
  const [ switchColors, setSwitchColors ] =
    React.useState<{ background: string; foreground: string }>(getSwitchColors(props.enabled));

  React.useEffect(() => {
    const controller = new AbortController();
    setTimeout(() => {
      if (controller.signal.aborted) return;
      setSwitchColors(getSwitchColors(props.enabled));
    }, 100);
    return () => controller.abort();
  }, [ props.enabled ]);

  return (
    <Button background={false} onPress={props.onSwitch} pressableStyle={styles.item}>
      <View style={[ styles.itemDot, { backgroundColor: props.color }]}/>
      <Text style={[ styles.itemTitle, { color: props.enabled ? '#c0d8dd' : '#567' }]}>{props.title}</Text>
      <Switch
        trackColor={{ false: switchColors.background, true: switchColors.background }}
        thumbColor={switchColors.foreground}
        value={props.enabled} onValueChange={props.onSwitch}/>
    </Button>
  );
};

export default function CalendarsScreen() {
  const [ calendars, setCalendars ] = React.useState<Calendars.Calendar[]>([]);

  const refreshCalendars = async () => {
    setCalendars((await Calendars.getCalendars()).sort((a, b) => a.title.localeCompare(b.title)));
  };

  React.useEffect(() => void(refreshCalendars()), []);

  const handleToggle = async (ind: number) => {
    const newCalendars: Calendars.Calendar[] = JSON.parse(JSON.stringify(calendars));
    newCalendars[ind].enabled = !newCalendars[ind].enabled;
    setCalendars(newCalendars);
    Calendars.setCalendars(newCalendars.filter(c => c.enabled).map(c => c.id));
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={calendars}
        contentContainerStyle={styles.scrollViewInner}
        renderItem={({ item, index }) => <CalendarItem color={item.color} title={item.title}
          enabled={item.enabled} onSwitch={() => handleToggle(index)}/>}
        ItemSeparatorComponent={() => <View style={styles.separator}/>}
        // onRefresh={() => void(refreshCalendars)}
        // refreshing={false}
      />
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
    padding: 8
  },
  separator: {
    height: 1,
    marginVertical: 8,
    backgroundColor: '#11161f'
  },
  item: {
    flexDirection: 'row'
  },
  itemDot: {
    width: 12,
    height: 12,
    borderRadius: 9999,
    marginRight: 20,
    marginLeft: 8
  },
  itemTitle: {
    fontSize: 16,
    flex: 1
  },
});
