import * as React from 'react';
import { StyleSheet, Switch as DefaultSwitch } from 'react-native';

import Label from './Label';
import Button from './Button';
import withWrap from './withWrap';

interface SwitchColors { disabled: [ string, string ], enabled: [ string, string ] };

const DEFAULT_SWITCH_COLORS = {
	disabled: [ '#123', '#789' ],
	enabled: [ '#c46abd', '#ffc9fb' ]
};

interface Props {
	value: boolean;
	onValue?: () => void;

	label?: any;
	children?: any;

	rippleColor?: string;
	switchColor?: SwitchColors;

	style?: any,
	pressableStyle?: any,
	switchStyle?: any;
	labelStyle?: any
}

export default withWrap(function Switch(props: Props) {
  const [ switchColors, setSwitchColors ] = React.useState<[ string, string ]>(
		(props.switchColor ?? DEFAULT_SWITCH_COLORS)[props.value ? 'enabled' : 'disabled'] as any);

  React.useEffect(() => {
    const controller = new AbortController();
    setTimeout(() => {
      if (controller.signal.aborted) return;
      setSwitchColors((props.switchColor ?? DEFAULT_SWITCH_COLORS)
				[props.value ? 'enabled' : 'disabled'] as any);
    }, 100);
    return () => controller.abort();
  }, [ props.value ]);

  return (
    <Button background={false} onPress={props.onValue}
			pressableStyle={[ styles.switch, props.pressableStyle ]} rippleColor={props.rippleColor ?? '#345'}>
			{props.label && <Label
				style={[ styles.label, props.labelStyle ]}
			>{props.label}</Label>}
			{props.children}
      <DefaultSwitch
        trackColor={{ false: switchColors[0], true: switchColors[0] }}
        thumbColor={switchColors[1]}
        value={props.value}
				onValueChange={props.onValue}/>
    </Button>
  );
}, true);


const styles = StyleSheet.create({
	switch: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	label: {
		textTransform: 'none',
		letterSpacing: 0,
		fontSize: 16,
		marginTop: 0,
		paddingLeft: 8
	}
});
