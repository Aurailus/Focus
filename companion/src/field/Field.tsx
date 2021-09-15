import * as React from 'react';
import { View, StyleSheet } from 'react-native';

interface Props {
	style?: any;
	children?: any;
}

export default function Field(props: Props) {
	return (
		<View style={[ styles.field, props.style ]}>{props.children}</View>
	);
}

const styles = StyleSheet.create({
	field: {
		marginTop: 8,
		borderRadius: 8,
		marginBottom: 16,
		overflow: 'hidden',
		backgroundColor: '#181f24'
	}
});
