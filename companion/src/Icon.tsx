import * as React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

/** The default icon size, if none is specified. */
export const DEFAULT_ICON_SIZE = 24;

/** The valid icon names that can be provided to <Icon/> */
export type IconName = 'calendar' | 'theme' | 'heart';

interface IconProps {
	width?: number | string;
	height?: number | string;
	color?: string | undefined;
	colorPrimary?: string | undefined;
	colorSecondary?: string | undefined;
}

/** Gets the derived values from an IconProps. */
function useIconDerivedProps(props: IconProps) {
	const width = props.width ?? DEFAULT_ICON_SIZE;
	const height = props.height ?? width;
	const colorSecondary = props.color ?? props.colorPrimary ?? '#fff';
	const colorPrimary = props.colorSecondary ??
		(colorSecondary.length === 4 ? colorSecondary + '9' : colorSecondary + '99');

	return { width, height, colorPrimary, colorSecondary };
}

/* Below are components to render specific icons. */

export function Calendar(props: IconProps) {
	const { width, height, colorPrimary, colorSecondary } = useIconDerivedProps(props);
	return (
		<Svg viewBox='0 0 24 24' width={width} height={height}>
			<Path fill={colorPrimary} d='M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6c0-1.1.9-2 2-2zm0 5v10h14V9H5z'/>
			<Path fill={colorSecondary} d='M13 13h3v3h-3v-3zM7 2a1 1 0 0 1 1 1v3a1 1 0 1 1-2 0V3a1 1 0 0 1 1-1zm10 0a1 1 0 0 1 1 1v3a1 1 0 0 1-2 0V3a1 1 0 0 1 1-1z'/>
		</Svg>
	);
}

export function Theme(props: IconProps) {
	const { width, height, colorPrimary, colorSecondary } = useIconDerivedProps(props);
	return (
		<Svg viewBox='0 0 24 24' width={width} height={height}>
			<Path fill={colorPrimary} d='M9 22c.19-.14.37-.3.54-.46L17.07 14H20a2 2 0 0 1 2 2v4a2 2 0 0 1-2 2H9zM4 2h4a2 2 0 0 1 2 2v14a4 4 0 1 1-8 0V4c0-1.1.9-2 2-2zm2 17.5a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3z'/>
			<Path fill={colorSecondary} d='M11 18.66V7.34l2.07-2.07a2 2 0 0 1 2.83 0l2.83 2.83a2 2 0 0 1 0 2.83L11 18.66z'/>
		</Svg>
	);
}

export function Heart(props: IconProps) {
	const { width, height, colorPrimary, colorSecondary } = useIconDerivedProps(props);
	return (
		<Svg viewBox='0 0 24 24' width={width} height={height}>
			<Circle fill={colorPrimary} cx="12" cy="12" r="10"/>
			<Path fill={colorSecondary} d="M12.88 8.88a3 3 0 1 1 4.24 4.24l-4.41 4.42a1 1 0 0 1-1.42 0l-4.41-4.42a3 3 0 1 1 4.24-4.24l.88.88.88-.88z"/>
		</Svg>
	);
}

/** A mapping of icon name to component. */
const ICON_COMPONENTS: Record<IconName, React.FunctionComponent<IconProps>> = {
	'calendar': Calendar,
	'theme': Theme,
	'heart': Heart
};

interface Props extends IconProps {
	icon: IconName;
}

/**
 * Renders whatever icon is provided in the `icon` prop.
 */

export default function Icon(props: Props) {
	const Component = ICON_COMPONENTS[props.icon];
	return <Component {...props}/>;
}
