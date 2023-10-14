import Dropdown, { Option } from 'react-dropdown';
import React, { useState } from 'react';
import './GWDropdown.css';

interface IProps {
	options: any[],
	defaultOption: string;
	labelText?: string;
	required?: boolean;
	onChange: (value: string) => void;
}

const GWDropdown: React.FC<IProps> = (props) => {

	const [isDirty, setIsDirty] = useState(false);

	const onChange = (option: Option) => {
		props.onChange(option.value);
		setIsDirty(true);
	};

	return (
		<div>
			<div className='d-flex justify-content-between'>
				{props.labelText &&
					<label style={{ marginBottom: '3px' }} className='gw-label'> {props.labelText} </label>}
				{props.required && <small className='text-danger'> Required </small>}
			</div>
			<Dropdown
				onChange={onChange} menuClassName='gw-dropdown-menu border-1 shadow-sm'
				controlClassName={`gw-dropdown-control ${isDirty && !props.defaultOption ? 'border-danger' : ''}`}
				arrowClassName='mt-2'
				options={props.options}
				value={props.defaultOption}
			/>
		</div>

	);
};

export default GWDropdown;
