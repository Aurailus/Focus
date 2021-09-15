import * as React from 'react';
import { Text, StyleSheet } from 'react-native';

interface Props {
	text?: string;
	children?: any;
	style?: any;
}

export default function Label(props: Props) {
	return (
		<Text style={[ styles.label, props.style ]}>{props.text}{props.children}</Text>
	);
}

const styles = StyleSheet.create({
	label: {
		fontSize: 12,
		textTransform: 'uppercase',
		letterSpacing: 1,
		marginTop: 8,
		color: '#abc'
	}
});
