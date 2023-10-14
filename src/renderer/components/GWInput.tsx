import React, { useState } from 'react';
import './GWInput.css';
// @ts-ignore
import * as Unicons from '@iconscout/react-unicons';

interface IProps {
	style?: React.CSSProperties,
	className?: string,
	labelText?: string,
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	onClickClear?: (e: any) => void
	value: string
	required?: boolean
}

const GWInput: React.FC<IProps> = (props) => {

	const [isDirty, setIsDirty] = useState(false);

	const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (!isDirty) {
			setIsDirty(true);
		}
		props.onChange(e);
	};

	const setError = () => {
		return isDirty && props.required && props.value.length === 0;
	};

	return (
		<div style={props?.style} className={`${props.className} gw-input`}>
			<div className='d-flex justify-content-between'>
				{props.labelText &&
					<label style={{ marginBottom: '0px' }} className='gw-label'> {props.labelText} </label>}
				{props.required && <small className='text-danger'> Required </small>}
			</div>
			<div className='d-flex'>
				<input className={`${setError() ? 'border-danger' : ''}`} value={props.value} type='text'
				       onChange={onChange} />
				{props.onClickClear &&
					<button onClick={props.onClickClear} className='d-flex align-items-center justify-content-center'>
						<Unicons.UilMultiply size='24px' color='#14B8A6' /></button>}
			</div>
		</div>
	);
};

export default GWInput;
