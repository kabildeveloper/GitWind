import GWCardAccount from '../components/GWCardAccount';
import React, { useCallback, useEffect, useState } from 'react';
import { Account, AlertModalData, getAllUsersResult, returnStringResult } from '../../types/types';
import GWBrowseInput from '../components/GWBrowseInput';
import { useNavigate } from 'react-router-dom';
import { responseHandler } from '../util';
import AlertModal from '../components/AlertModal';
import { isEmpty } from 'lodash';

const { ipcRenderer } = window.electron;

const ChangeAccountPage = () => {

	const navigate = useNavigate();

	const [existingAccounts, setExistingAccounts] = useState<Account[]>([]);
	const [selectedAccount, setSelectedAccount] = useState<Account>({
		id: -1,
		email: '',
		username: '',
		sshFilePath: ''
	});
	const [alertModalData, setAlertModalData] = useState<AlertModalData>({
		message: [],
		success: true,
		isOpened: false
	});
	const [repoPath, setRepoPath] = useState<string>('');

	useEffect(() => {
		loadAccounts();
		const setAccountsHandler = setAccounts();

		const remove_repo_path_listener = ipcRenderer.on('selected-dir-path', (data: returnStringResult) => {
			const { message, success } = responseHandler(data);
			if (success) {
				setRepoPath(data.data);
			} else {
				setAlertModalData({ isOpened: true, message, success });
			}
		});

		const removeOnSaveUserRepoResponse = ipcRenderer.on('on-save-user-repo-response', (data: returnStringResult) => {
			const { message, success } = responseHandler(data);
			setAlertModalData({ isOpened: true, message, success });
		});

		return () => {
			setAccountsHandler();
			remove_repo_path_listener();
			removeOnSaveUserRepoResponse();
		};

	}, []);

	const loadAccounts = () => {
		ipcRenderer.sendMessage('all-users');
	};

	const onClickAccount = (acc: Account) => {
		setSelectedAccount(acc);
	};

	const setAccounts = () => {
		return ipcRenderer.on('all-users-response', (data: getAllUsersResult) => {
			if (data.data) {
				setExistingAccounts(data.data);
			}
		});
	};

	const onClickBrowse = useCallback(() => {
		// true = it tells the service to check is it a valid git repository (directory)
		ipcRenderer.sendMessage('on-click-browse', true);
	}, []);

	const onChangeRepoDir = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setRepoPath(event.target.value);
	}, []);

	const onClickBack = () => navigate(-1);
	const onClickSave = () => {
		ipcRenderer.sendMessage('on-save-user-repo', { ...selectedAccount, repoPath: repoPath });
	};

	const closeModal = () => {
		setAlertModalData({ ...alertModalData, isOpened: false });
		if (alertModalData.success) {
			navigate(-1);
		}
	};

	const validateInputs = (): boolean => {
		return selectedAccount.id !== -1 && !isEmpty(repoPath);
	};

	return (
		<section>
			<div className='container mt-2'>
				<div className='row px-4 pt-3 pb-4'>
					<div className='col'>
						<h4>Choose Account</h4>
						<label className='gw-label'> Choose a valid git account </label>
					</div>
					<div className='col'>
						<h4>Choose Repository</h4>
						<label className='gw-label'> Choose a valid git repository </label>
					</div>
				</div>
				<div className='row'>
					<div className='col'>
						<div className='gw-card-accounts-container px-4'>
							{existingAccounts.map((acc) => (
								<GWCardAccount selected={acc.id === selectedAccount.id} key={acc.id} account={acc}
								               onClickAccount={onClickAccount} />
							))}
						</div>
					</div>
					<div className='col border-start'>
						<div style={{ height: '300px', overflowY: 'auto' }} className='px-4'>
							<GWBrowseInput value={repoPath} onChange={onChangeRepoDir} onClick={onClickBrowse} />
						</div>
					</div>
				</div>
				<div className='row mx-2 py-3'>
					<div className='d-flex gap-2 justify-content-center'>
						<button onClick={onClickBack} style={{ width: 'fit-content' }}
						        className='gw-button gw-button-dark'>Back
						</button>
						<button disabled={!validateInputs()} onClick={onClickSave} style={{ width: 'fit-content' }}
						        className='ms-1 gw-button gw-button-primary'>Save
						</button>
					</div>
				</div>
			</div>
			<AlertModal {...alertModalData} onClickClose={closeModal} />
		</section>
	);
};

export default ChangeAccountPage;
