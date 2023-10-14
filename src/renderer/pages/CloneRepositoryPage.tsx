import React, { useCallback, useEffect, useState } from 'react';
import GWDropdown from '../components/GWDropdown';
import GWInput from '../components/GWInput';
import GWBrowseInput from '../components/GWBrowseInput';
import { Account, AlertModalData, cloneRepoRequest, getAllUsersResult, returnStringResult } from '../../types/types';
import { isValidGitUrl, responseHandler } from '../util';
import { useNavigate } from 'react-router-dom';
import { isEmpty } from 'lodash';
import AlertModal from '../components/AlertModal';

const { ipcRenderer } = window.electron;

const CloneRepositoryPage: React.FC = () => {

	const navigate = useNavigate();

	const [existingAccounts, setExistingAccounts] = useState<Account[]>([]);
	const [selectedAccount, setSelectedAccount] = useState<Account>({
		id: -1,
		email: '',
		username: '',
		sshFilePath: '' // This field have nothing to do with the UI, it is here to be sent along with the other account fields while cloning, to reduce one more db call.
	});

	const options = existingAccounts.map((x) => x.username);
	const [repoPath, setRepoPath] = useState<string>('');
	const [branch, setBranch] = useState<string>('');
	const [url, setUrl] = useState<string>('');
	const [progress, setProgress] = useState<number>(0);

	const [alertModalData, setAlertModalData] = useState<AlertModalData>({
		message: [],
		success: true,
		isOpened: false
	});

	const loadAccounts = () => {
		ipcRenderer.sendMessage('all-users');
	};

	const setAccounts = () => {
		return ipcRenderer.on('all-users-response', (data: getAllUsersResult) => {
			if (data.data) {
				setExistingAccounts(data.data);
			}
		});
	};

	const repoPathListener = () => {
		return ipcRenderer.on('selected-dir-path', (data: string) => {
			setRepoPath(data);
		});
	};

	const onCloneResponseListener = () => {
		return ipcRenderer.on('clone-response', (resp: returnStringResult) => {
			const { success, message } = responseHandler(resp);
			if (resp.isSuccessful) {
				setProgress(100);
			} else {
				setProgress(0);
			}
			setAlertModalData({ message, success, isOpened: true });
		});
	};

	const cloneProgressTracker = () => {
		return ipcRenderer.on('clone-progress', (data: number) => {
			setProgress(Math.ceil(data * 100));
			console.log('clone-progress', data);
		});
	};

	useEffect(() => {
		const setAccountsHandler: () => void = setAccounts();
		const cloneProgressHandler: () => void = cloneProgressTracker();
		const repoPathHandler: () => void = repoPathListener();
		const cloneResponseHandler: () => void = onCloneResponseListener();
		loadAccounts();
		return () => {
			setAccountsHandler();
			cloneProgressHandler();
			repoPathHandler();
			cloneResponseHandler();
		};
	}, []);


	const onChangeGitUser = (username: string) => {
		const selectedAcc = existingAccounts.find(x => x.username === username);
		if (selectedAcc) {
			setSelectedAccount(selectedAcc);
		}
	};

	const onClickBrowse = useCallback(() => {
		// false = it tells the service to accept any valid folder path.
		ipcRenderer.sendMessage('on-click-browse', false);
	}, []);

	const onChangeRepoDir = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setRepoPath(event.target.value);
	}, []);

	const onChangeUrl = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setUrl(event.target.value);
	}, []);

	const onChangeBranch = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
		setBranch(event.target.value);
	}, []);

	const onClone = () => {
		if (isValidGitUrl(url)) {
			const data: cloneRepoRequest = {
				id: selectedAccount.id,
				branch: branch,
				email: selectedAccount.email,
				repoPath: repoPath,
				url: url,
				username: selectedAccount.username,
				sshFilePath: selectedAccount.sshFilePath
			};
			ipcRenderer.sendMessage('on-clone', data);
		} else {
			setAlertModalData({ success: false, isOpened: true, message: 'The given url is not a valid git repo url' });
		}
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

	const disableCloneButton = () => {
		return selectedAccount.id === -1 || isEmpty(repoPath) || isEmpty(url) || !isValidGitUrl(url);
	};

	return (
		<section>
			<div className='gw-info-banner text-center py-1'>
				Note: Currently we are supporting SSH based authentication for private repositories. So please consider
				using SSH URL for cloning private repositories.
			</div>
			<div className='container mt-4'>
				<div className='row px-4 pt-3 pb-4'>
					<div className='col'>
						<h4>Clone Details</h4>
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
							<GWInput required labelText='Repository URL' onChange={onChangeUrl} value={url} />
						</div>
					</div>
				</div>
				<div className='row mt-4'>
					<div className='col'>
						<div className='px-4'>
							<GWInput labelText='Branch name' onChange={onChangeBranch} value={branch} />
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
						<button disabled={disableCloneButton()} onClick={onClone} style={{ width: 'fit-content' }}
						        className='ms-1 gw-button gw-button-primary'>Clone
						</button>
					</div>
				</div>
				<div className='row mx-2 py-3 mt-5'>
					<div className='col'>
						<div className='progress' role='progressbar'>
							<div className='progress-bar' style={{ width: `${progress}%` }}>{`${progress}%`}</div>
						</div>
					</div>
				</div>
			</div>
			<AlertModal {...alertModalData} onClickClose={closeModal} />
		</section>
	);
};

export default CloneRepositoryPage;
