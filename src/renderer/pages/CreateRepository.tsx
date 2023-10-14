import React, { useCallback, useEffect, useState } from 'react';
import GWDropdown from '../components/GWDropdown';
import { Account, AlertModalData, createRepoRequest, getAllUsersResult, returnStringResult } from '../../types/types';
import GWBrowseInput from '../components/GWBrowseInput';
import { useNavigate } from 'react-router-dom';
import AlertModal from '../components/AlertModal';
import { isEmpty } from 'lodash';
import { responseHandler } from '../util';

const { ipcRenderer } = window.electron;
const CreateRepository: React.FC = () => {

	const navigate = useNavigate();

	const [existingAccounts, setExistingAccounts] = useState<Account[]>([]);
	const [selectedAccount, setSelectedAccount] = useState<Account>({
		id: -1,
		email: '',
		username: '',
		sshFilePath: ''
	});
	const [repoPath, setRepoPath] = useState<string>('');
	const [alertModalData, setAlertModalData] = useState<AlertModalData>({
		message: [],
		success: true,
		isOpened: false
	});

	const options = existingAccounts.map((x) => x.username);

	const loadAccounts = () => {
		ipcRenderer.sendMessage('all-users');
	};

	const repoPathListener = () => {
		return ipcRenderer.on('selected-dir-path', (data: string) => {
			setRepoPath(data);
		});
	};

	const initResponseListener = () => {
		return ipcRenderer.on('init-repo-response', (resp: returnStringResult) => {
			const { message, success } = responseHandler(resp);
			setAlertModalData({ message, success, isOpened: true });
		});
	};

	useEffect(() => {
		const setAccountsHandler: () => void = setAccounts();
		const repoPathHandler: () => void = repoPathListener();
		const initResponseHandler: () => void = initResponseListener();
		loadAccounts();
		return () => {
			setAccountsHandler();
			repoPathHandler();
			initResponseHandler();
		};
	}, []);

	const onChangeGitUser = (username: string) => {
		const selectedAcc = existingAccounts.find(x => x.username === username);
		if (selectedAcc) {
			setSelectedAccount(selectedAcc);
		}
	};

	const onChangeRepoDir = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setRepoPath(event.target.value);
	}, []);

	const onClickBrowse = useCallback(() => {
		// false = it tells the service to accept any valid folder path.
		ipcRenderer.sendMessage('on-click-browse', false);
	}, []);

	const setAccounts = () => {
		return ipcRenderer.on('all-users-response', (data: getAllUsersResult) => {
			if (data.data) {
				setExistingAccounts(data.data);
			}
		});
	};

	const closeModal = () => {
		setAlertModalData({ ...alertModalData, isOpened: false });
		if (alertModalData.success) {
			navigate(-1);
		}
	};

	const onClickBack = () => {
		navigate(-1);
	};

	const disableCreateButton = () => {
		return selectedAccount.id === -1 || isEmpty(repoPath);
	};

	const onCreate = () => {
		let payload: createRepoRequest = {
			...selectedAccount,
			repoPath: repoPath
		};
		ipcRenderer.sendMessage('init-repo', payload);
	};

	return (
		<section>
			<div className='container mt-2'>
				<div className='row px-4 pt-3 pb-4'>
					<div className='col'>
						<h4>Create Repository</h4>
					</div>
				</div>
				<div className='row'>
					<div className='col'>
						<div className='px-4'>
							<GWDropdown required labelText='Select Account' onChange={onChangeGitUser} options={options}
							            defaultOption={selectedAccount.username} />
						</div>
					</div>
					<div className='col'>
						<div className='px-4'>
							<GWBrowseInput labelText='Select Folder' required value={repoPath}
							               onChange={onChangeRepoDir} onClick={onClickBrowse} />
						</div>
					</div>
				</div>
				<div className='row mx-2 py-3 mt-5'>
					<div className='d-flex gap-2 justify-content-center'>
						<button onClick={onClickBack} style={{ width: 'fit-content' }}
						        className='gw-button gw-button-dark'>Back
						</button>
						<button disabled={disableCreateButton()} onClick={onCreate} style={{ width: 'fit-content' }}
						        className='ms-1 gw-button gw-button-primary'>Create
						</button>
					</div>
				</div>
			</div>
			<AlertModal {...alertModalData} onClickClose={closeModal} />
		</section>
	);
};

export default CreateRepository;
