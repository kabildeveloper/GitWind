// @ts-ignore
import * as Unicons from '@iconscout/react-unicons';
import './GWBrowseInput.css';
import React from 'react';

interface IProps {
	onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
	onClick: (event: React.MouseEvent<HTMLButtonElement>) => void;
	value: string;
	required?: boolean;
	labelText?: string,
}

const GWBrowseInput: React.FC<IProps> = ({ value, onChange, onClick, labelText, required }) => {

	return (
		<div>
			<div className='d-flex justify-content-between'>
				{labelText && <label style={{ marginBottom: '3px' }} className='gw-label'> {labelText} </label>}
				{required && <small className='text-danger'> Required </small>}
			</div>
			<div className='gw-browse-input-container d-flex align-items-center justify-content-between'>
				<input value={value} placeholder='Browse or enter path' onChange={onChange} />
				<button onClick={onClick} className='d-flex align-items-center justify-content-center p-0'>
					<Unicons.UilFolderOpen size='24px' color='#ffffff' />
				</button>
			</div>
		</div>
	);
};

export default GWBrowseInput;
