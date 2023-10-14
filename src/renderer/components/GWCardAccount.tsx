import React from 'react';
import './GWCardAccount.css';
import { Account } from '../../types/types';
// @ts-ignore
import * as Unicons from '@iconscout/react-unicons';

interface IProps {
	account: Account;
	onClickDelete?: (id: number) => void;
	onClickAccount?: (data: Account) => void;
	selected?: boolean;
}

const GWCardAccount: React.FC<IProps> = ({ account, onClickDelete, onClickAccount, selected }) => {

	const onClickDeleteBtn = (e: React.MouseEvent<HTMLButtonElement>) => {
		if (account.id && onClickDelete) {
			onClickDelete(account.id);
		}
	};

	const onClick = (e: React.MouseEvent<HTMLDivElement>) => {
		if (onClickAccount) {
			onClickAccount(account);
		}
	};


	return (
		<div key={account.id} className='d-flex gw-existing-account align-items-center'>
			<div onClick={onClick}
			     className={`gw-card-account ${onClickAccount ? 'cursor-pointer' : ''} ${selected ? 'active shadow-sm' : ''} d-flex align-items-center my-2`}>
				<div className='px-3'>
					<p className='mb-0 user-name'>{account.username}</p>
					<p className='mb-0 user-email'>{account.email}</p>
				</div>
			</div>

			{onClickDelete && <button onClick={onClickDeleteBtn} className='delete p-0 bg-transparent ms-3'>
				<Unicons.UilTrashAlt className='icon' size='24px' color='red' />
			</button>}

		</div>

	);
};

export default GWCardAccount;
