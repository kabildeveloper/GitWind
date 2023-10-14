import React, { useEffect, useState } from 'react';
import './Navbar.css';
import { MinToastOptions, NotificationContent, toastFactory, ToastType } from './Notification';
import { UpdateInfo } from 'electron-updater';
const { ipcRenderer } = window.electron;

const Navbar: React.FC = () => {

	const [updateVersion, setUpdateVersion] = useState("");

	useEffect(() => {
		ipcRenderer.on('update-available', (data: UpdateInfo)=>{
			setUpdateVersion(data.version);
			showUpdateToast();
		});

		ipcRenderer.on('update-not-available', ()=>{
			showUpdateNotAvailableToast();
		});

		ipcRenderer.on('update-downloaded', ()=>{
			showInstallToast();
		});

	}, []);

	const downloadHandler = () => {
		ipcRenderer.sendMessage('download-update');
	}

	const installHandler = () => {
		ipcRenderer.sendMessage('install-update');
	}

	const showUpdateToast = () => {
		const toastFunc = toastFactory(ToastType.INFO);
		toastFunc( <NotificationContent message={`Updates available`} actionName="Download" actionHandler={downloadHandler}/> , MinToastOptions);
	}

	const showInstallToast = () => {
		const toastFunc = toastFactory(ToastType.INFO);
		toastFunc( <NotificationContent message={`Update downloaded`} actionName="Quit and Install" actionHandler={installHandler}/> , MinToastOptions);
	}

	const showUpdateNotAvailableToast = () => {
		const toastFunc = toastFactory(ToastType.INFO);
		toastFunc( <NotificationContent message='Update not available' actionName={"Download"}/> , MinToastOptions);
	}

	return (
		<nav className='gw-navbar d-flex px-3 align-items-center gap-2 text-white'>
			<img className='h-100 py-3' src={require('../../../assets/logos/gw_logo_light.png')} alt='Git wind' />
			<h4 className='mb-0'> Git Wind </h4>
		</nav>
	);
};

export default Navbar;
