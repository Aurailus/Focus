import * as React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Icon, { IconName } from './Icon';
import { RootStackParamList, RootTabParamList } from '../types';
import { ModalScreen, CalendarsScreen, ThemesScreen, AboutScreen } from './screens';
import Animated, { withTiming, useAnimatedStyle, Easing } from 'react-native-reanimated';

import { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';

/**
 * The linking for the different screens.
 */

const LINKING: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Calendars: {
            screens: {
              CalendarsScreen: 'calendar',
            },
          },
          Theme: {
            screens: {
              ThemeScreen: 'theme',
            },
          },
          About: {
            screens: {
              AboutScreen: 'about',
            },
          }
        },
      },
      Modal: 'modal',
      NotFound: '*',
    },
  },
};

/** Displays the active screen based on the linking. */
const Stack = createNativeStackNavigator<RootStackParamList>();

const NAVIGATION_THEME = {
	dark: true,
	colors: {
		primary: 'white',
		background: 'transparent',
		card: '#0c1014',
		text: 'white',
		border: 'transparent',
		notification: 'red'
	}
};

/**
 * Renders the navigation and active screen.
 */

export default function Navigation() {
	return (
		<NavigationContainer linking={LINKING} theme={NAVIGATION_THEME}>
			<Stack.Navigator>
				<Stack.Screen name='Root' component={BottomTabNavigator} options={{ headerShown: false }} />
				<Stack.Group screenOptions={{ presentation: 'modal' }}>
					<Stack.Screen name='Modal' component={ModalScreen} />
				</Stack.Group>
			</Stack.Navigator>
		</NavigationContainer>
	);
}

/** Displays a tab bar at the bottom of the screen. */
const BottomTab = createBottomTabNavigator<RootTabParamList>();

/**
 * Renders the bottom navigation.
 */

function BottomTabNavigator() {
	return (
		<BottomTab.Navigator
			initialRouteName='Calendars'
			screenOptions={{
				headerShown: false,
				tabBarStyle: { height: 64 }
			}}>
			<BottomTab.Screen
				name='Calendars'
				component={CalendarsScreen}
				options={{
					title: 'Calendars',
					tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} icon='calendar'/>,
					tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} title='Calendars'/>
				}}
			/>
			<BottomTab.Screen
				name='Theme'
				component={ThemesScreen}
				options={{
					title: 'Theme',
					tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} icon='theme'/>,
					tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} title='Theme'/>
				}}
			/>
			<BottomTab.Screen
				name='About'
				component={AboutScreen}
				options={{
					title: 'About',
					tabBarIcon: ({ focused }) => <TabBarIcon focused={focused} icon='heart'/>,
					tabBarLabel: ({ focused }) => <TabBarLabel focused={focused} title='About'/>
				}}
			/>
		</BottomTab.Navigator>
	);
}

/** Handles animating tab bar labels. */
const ANIM_CONFIG = { duration: 100, easing: Easing.inOut(Easing.ease) };

interface TabBarIconProps {
	icon: IconName;
	focused: boolean;
}

/**
 * Renders the icon for a tab in the tab bar.
 */

function TabBarIcon(props: TabBarIconProps) {
	return (
		<Icon icon={props.icon} width={28} height={28}
			color={props.focused ? '#ffc9fb' : '#789'}
			colorSecondary={props.focused ? '#c46abd' : '#345'}/>
	);
}

interface TabBarLabelProps {
	title: string;
	focused: boolean;
}

/**
 * Renders the label for a tab in the tab bar.
 */

function TabBarLabel(props: TabBarLabelProps) {
	const style = useAnimatedStyle(() => ({
		opacity: withTiming(props.focused ? 1 : 0, ANIM_CONFIG),
		fontSize: withTiming(props.focused ? 11 : 8, ANIM_CONFIG),
		marginTop: withTiming(props.focused ? -6 : -20, ANIM_CONFIG),
		marginBottom: withTiming(props.focused ? 10 : 6, ANIM_CONFIG),
	}), [ props.focused ]);

	return (
		<Animated.Text style={[{ color: '#ffe8fd', }, style]}>
			{props.title}
		</Animated.Text>
	);
}
