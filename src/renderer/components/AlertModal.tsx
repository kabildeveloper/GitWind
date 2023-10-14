import { Modal } from 'react-bootstrap';
// @ts-ignore
import * as Unicons from '@iconscout/react-unicons';
import React from 'react';
import { AlertModalData } from '../../types/types';
import _ from 'lodash';

interface IProps extends AlertModalData {
	onClickClose: (event: React.MouseEvent<HTMLButtonElement>) => void;
}

const AlertModal: React.FC<IProps> = ({ isOpened, message, success, onClickClose }) => {
	return (
		<Modal show={isOpened} centered>
			<Modal.Header>
				{success ? 'Success' : 'Failed'}
			</Modal.Header>
			<Modal.Body>
				<div className='d-flex flex-column align-items-center'>
					<div className='d-flex align-items-center gap-2 mb-3'>
						{_.isString(message) && <p className='mb-0'>{message}</p>}
						{_.isArray(message) && <ul className='mb-0'>
							{
								message.map((msg, i) => {
									return (
										<li key={i}>{msg}</li>
									);
								})
							}
						</ul>
						}
						{success ? (<Unicons.UilCheckCircle color='green' size='32px' />) : (
							<Unicons.UilExclamationOctagon color='red' size='32px' />)}
					</div>
					<button onClick={onClickClose} style={{ width: 'fit-content' }}
					        className='gw-button gw-button-dark'>Close
					</button>
				</div>
			</Modal.Body>
		</Modal>
	);
};

export default AlertModal;
