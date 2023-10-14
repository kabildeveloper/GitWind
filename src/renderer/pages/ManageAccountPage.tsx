import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import GWInput from '../components/GWInput';
import GWCardAccount from '../components/GWCardAccount';
import { Account, AlertModalData, getAllUsersResult, returnStringResult, UserResult } from '../../types/types';
import AlertModal from '../components/AlertModal';
import { responseHandler } from '../util';
import emailValidator from 'email-validator';
import GWBrowseInput from '../components/GWBrowseInput';

const { ipcRenderer } = window.electron;

const ManageAccountPage: React.FC = () => {

	const navigate = useNavigate();

	const [alertModalData, setAlertModalData] = useState<AlertModalData>({
		message: '',
		success: true,
		isOpened: false
	});

	const [accountData, setAccountData] = useState<Pick<Account, 'username' | 'email'>>({
		username: '',
		email: ''
	});

	const [existingAccounts, setExistingAccounts] = useState<Account[]>([]);

	/**
	 * DO NOT MODIFY: We have used separate state for sshFilePath because, it listens to the Dialog event, where the event listener
	 * @function sshFilePathListener have different closure, so it only have data when the React loads,
	 * which causes side effects to other state variables when we combine with other state variables
	 * */
	const [SSHFilePath, setSSHFilePath] = useState<string>('');

	const loadAccounts = () => {
		ipcRenderer.sendMessage('all-users');
	};

	const saveAccount = () => {
		return ipcRenderer.on('save-user-response', (data: UserResult) => {
			const { message, success } = responseHandler(data, `Account ${data.data?.username} added successfully`);
			if (success) {
				setAccountData({
					username: '',
					email: ''
				});
				loadAccounts();
			}
			setAlertModalData({ isOpened: true, message: message, success: success });
		});
	};

	const setAccounts = () => {
		return ipcRenderer.on('all-users-response', (data: getAllUsersResult) => {
			if (data.data) {
				setExistingAccounts(data.data);
			}
		});
	};

	const deleteAccount = () => {
		return ipcRenderer.on('delete-user-response', (data: returnStringResult) => {
			if (data.data) {
				const { message, success } = responseHandler(data);
				if (success) {
					loadAccounts();
				}
				setAlertModalData({ isOpened: true, message: message, success: success });
			}
		});
	};

	const sshFilePathListener = () => {
		return ipcRenderer.on('selected-ssh-file-path', (data: returnStringResult) => {
			if (data.data) {
				const { message, success } = responseHandler(data);
				if (success) {
					setSSHFilePath(data.data);
				} else {
					setAlertModalData({ isOpened: true, message: message, success: false });
				}
			}
		});
	};

	useEffect(() => {
		loadAccounts();

		const saveAccountHandler = saveAccount();
		const setAccountsHandler = setAccounts();
		const deleteAccountHandler = deleteAccount();
		const sshFilePathHandler = sshFilePathListener();

		return () => {
			saveAccountHandler(); // Removing event listener
			setAccountsHandler(); // Removing event listener
			deleteAccountHandler();  // Removing event listener
			sshFilePathHandler();  // Removing event listener
		};
	}, []);

	const onClickBack = () => {
		navigate(-1);
	};

	const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAccountData({ ...accountData, email: e.target.value });
	};

	const onChangeUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
		setAccountData({ ...accountData, username: e.target.value });
	};

	const onClickBrowse = () => {
		ipcRenderer.sendMessage('on-click-browse-file');
	};

	const onChangeFilePath = (event: React.ChangeEvent<HTMLInputElement>) => {
		setSSHFilePath(event.target.value);
	};
	const onAddUser = () => {
		ipcRenderer.sendMessage('save-user', { ...accountData, sshFilePath: SSHFilePath });
	};

	const onDeleteUser = (id: number) => {
		ipcRenderer.sendMessage('delete-user', id);
	};

	const onHideModal = useCallback(() => {
		setAlertModalData({ ...alertModalData, isOpened: false });
	}, []);

	const disableButton = (): boolean => {
		return accountData.username.length < 4 || !emailValidator.validate(accountData.email);
	};

	return (
		<section>
			<div className='gw-info-banner text-center py-1'>
				Note: Currently we are not supporting authentication and authorization. It will be done by your git
				provider when you execute git operations.
			</div>
			<div className='container mt-2'>
				<div className='row px-4 pt-3 pb-4'>
					<div className='col'>
						<h4>Add Account</h4>
					</div>
					<div className='col'>
						<h4>Existing Accounts</h4>
					</div>
				</div>
				<div className='row'>
					<div className='col border-end'>
						<div className='px-4'>
							<GWInput onChange={onChangeUsername} value={accountData.username}
							         labelText='Enter your username' className='pb-3' />
							<GWInput onChange={onChangeEmail} value={accountData.email} labelText='Enter your email'
							         className='pb-3' />
							<div>
								<label className='gw-label'> Select SSH file </label>
								<GWBrowseInput onChange={onChangeFilePath} onClick={onClickBrowse}
								               value={SSHFilePath} />
							</div>

						</div>
					</div>
					<div className='col'>
						<div className='gw-card-accounts-container  px-4'>
							{
								existingAccounts.length > 0 ?
									existingAccounts.map((acc) => (
										<GWCardAccount key={acc.id} account={acc} onClickDelete={onDeleteUser} />
									))
									:
									<p className='text-black-50'> Add accounts to show up </p>
							}
						</div>
					</div>
				</div>
				<div className='row mx-2 py-3'>
					<div className='d-flex gap-2 justify-content-center'>
						<button disabled={disableButton()} onClick={onAddUser} style={{ width: 'fit-content' }}
						        className='ms-1 gw-button gw-button-primary'>Add
						</button>
						<button onClick={onClickBack} style={{ width: 'fit-content' }}
						        className='gw-button gw-button-dark'>Back
						</button>
					</div>
				</div>
			</div>
			<AlertModal {...alertModalData} onClickClose={onHideModal} />
		</section>
	);
};

export default ManageAccountPage;
