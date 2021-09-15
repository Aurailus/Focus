import * as React from 'react';
import Modal from 'react-native-modal';
import { View, StyleSheet, Pressable, FlatList } from 'react-native';

import Button from './Button';
import withWrap from './withWrap';

interface Props {
	value: string;
	onSelect?: (value: string) => void;
	data: { [key: string]: any, label: string, value: string }[];
}

export default withWrap(function Select(props: Props) {
	const [ selected, setSelected ] = React.useState<boolean>(false);

	const handleSelect = (value: string) => {
		props.onSelect?.(value);
		setSelected(false);
	};

	return (
		<React.Fragment>
			<Button background={false} rippleColor='#345'
				text={props.data.filter(i => props.value === i.value)[0].label}
				onPress={() => setSelected(true)}/>

			<Modal
				style={{ marginHorizontal: 32 }}
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
					<FlatList
						style={styles.modalScroll}
						contentContainerStyle={styles.modalContainer}
						ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
						data={props.data.map(d => ({ ...d, key: d.value }))}
						renderItem={({ item }) => <Pressable key={item.value} style={styles.modalOption}>
							<Button background={false} rippleColor='#123' text={item.label} onPress={() => handleSelect(item.value)}
								textStyle={props.value === item.value && styles.modalOptionActiveText}
								style={props.value === item.value && styles.modalOptionActive}/>
						</Pressable>}/>
				</View>
			</Modal>
		</React.Fragment>
	);
});

const styles = StyleSheet.create({
	modal: {
		elevation: 5,
		width: '100%',
		color: 'white',
		borderRadius: 8,
		overflow: 'hidden',
		backgroundColor: '#181f24'
	},
	modalScroll: {
		maxHeight: 400
	},
	modalContainer: {
		padding: 12
	},
	modalOption: {
		width: '100%'
	},
	modalOptionActive: {
		backgroundColor: '#1b262f'
	},
	modalOptionActiveText: {
		color: '#fff',
		fontWeight: 'bold'
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
