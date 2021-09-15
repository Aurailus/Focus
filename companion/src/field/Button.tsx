import * as React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import withWrap from './withWrap';

interface Props {
	onPress?: () => void;

	text?: string;

	children?: any;

	rippleColor?: string;

	style?: any,
	textStyle?: any
	pressableStyle?: any,
}

export default withWrap(function Button(props: Props) {
  return (
    <View style={[ styles.button, props.style ]}>
      <Pressable android_ripple={{ color: props.rippleColor ?? '#14181f' }}
				style={[ styles.pressable, props.pressableStyle ]}
				onPress={props.onPress}>
				{props.text && <Text style={[ styles.text, props.textStyle ]}>{props.text}</Text>}
				{props.children}
      </Pressable>
    </View>
  );
});

const styles = StyleSheet.create({
	button: {
    flex: 1,
		display: 'flex',
    overflow: 'hidden',
    minHeight: 52,
    borderRadius: 8,
		alignItems: 'center',
    justifyContent: 'center'
  },
  pressable: {
    flex: 1,
    padding: 12,
		width: '100%',
		display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
	text: {
		fontSize: 16,
		color: '#cde',
		paddingBottom: 1
	}
});
