import Label from './Label';
import Field from './Field';
import React from 'react';

interface Props {
	label?: string;
	background?: boolean;
}

export default function withWrap<P>(Elem: React.FunctionComponent<P>, labelPassthrough: boolean = false) {
	return function WithWrap(props: P & Props) {
		return (
			<React.Fragment>
				{props.label && !labelPassthrough && <Label text={props.label}/>}
				{(props.background ?? true)
					? <Field><Elem {...props}/></Field>
					: <Elem {...props}/>
				}
			</React.Fragment>
		);
	};
}
