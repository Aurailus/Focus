import * as React from 'react';
import Modal from 'react-native-modal';
import { View, StyleSheet, Pressable, FlatList } from 'react-native';

import Label from './Label';
import Button from './Button';
import withWrap from './withWrap';
import { ColorPicker } from 'react-native-color-picker';

interface Props {
	label?: string;
	value: string;
	children?: any;
	onValue?: (value: string) => void;

	style?: any,
	pressableStyle?: any,
	switchStyle?: any;
	labelStyle?: any
}

function hslToHex(h: number, s: number, l: number) {
	l /= 100;
	const a = s * Math.min(l, 1 - l) / 100;
	const f = (n: number) => {
		const k = (n + h / 30) % 12;
		const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
		return Math.round(255 * color).toString(16).padStart(2, '0');
	};
	return `#${f(0)}${f(8)}${f(4)}`;
}

export default withWrap(function Select(props: Props) {
	const [ selected, setSelected ] = React.useState<boolean>(false);

	const [ tempColor, setTempColor ] = React.useState<string>(props.value);

	const handlePick = () => {
		setSelected(true);
		setTempColor(props.value);
	};

	const handleChange = (color: any) => {
		setTempColor(hslToHex(color.h, 100, 50));
	};

	const handleSet = () => {
		props.onValue?.(tempColor);
		setSelected(false);
	};

	return (
		<React.Fragment>
			<Button background={false} rippleColor='#345' onPress={handlePick}
				style={props.style} pressableStyle={[ styles.color, props.pressableStyle, !props.label && styles.full ]}>
				{props.label && <Label style={[ styles.label, props.labelStyle ]}>{props.label}</Label>}
				{props.children}

				<View style={[ styles.preview, !props.label && styles.fullColor, { backgroundColor: props.value } ]}/>
			</Button>

			<Modal
				style={{ marginHorizontal: 64 }}
				animationIn={animationIn}
				animationInTiming={200}
				animationOut={animationOut}
				statusBarTranslucent={true}
				isVisible={selected}
				useNativeDriver={true}
				useNativeDriverForBackdrop={true}
				onBackButtonPress={() => setSelected(false)}
				onBackdropPress={() => setSelected(false)}>

				<View style={styles.modal}>
					<ColorPicker style={styles.picker} hideSliders
						oldColor={props.value} color={tempColor}
						onOldColorSelected={() => setTempColor(props.value)}
						onColorSelected={handleSet}
						onColorChange={handleChange}/>

					<Button text='Confirm' onPress={handleSet}
						style={{width: '100%', flex: 0, backgroundColor: '#1c262f' }} rippleColor='#283344'/>
				</View>
			</Modal>
		</React.Fragment>
	);
}, true);

const styles = StyleSheet.create({
	color: {
		flexDirection: 'row',
		justifyContent: 'space-between'
	},
	preview: {
		width: 40,
		height: 32,
		marginRight: 8,
		borderRadius: 4
	},
	label: {
		textTransform: 'none',
		letterSpacing: 0,
		fontSize: 16,
		marginTop: 0,
		paddingLeft: 8
	},
	picker: {
		width: '75%',
		height: 240,
		alignSelf: 'center',
	},
	modal: {
		elevation: 5,
		width: '100%',
		color: 'white',
		borderRadius: 8,
		overflow: 'hidden',
		paddingHorizontal: 12,
		backgroundColor: '#181f24'
	},
	modalContainer: {
		padding: 12
	},
	full: {
		padding: 0
	},
	fullColor: {
		flexGrow: 1,
		height: 52,
		marginRight: 0
	}
});

const animationIn = {
	from: { opacity: 0, transform: [{ scale: 0.85 }] },
	to: { opacity: 1, transform: [{ scale: 1 }] }
};

const animationOut = {
	from: animationIn.to,
	to: animationIn.from
};
