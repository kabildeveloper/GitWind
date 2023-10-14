import React from 'react';
import { toast, ToastOptions } from 'react-toastify';

export enum ToastType {
	"INFO",
	"ERROR",
	"SUCCESS",
	"WARN"
}

export const toastFactory = (type: ToastType) => {
	switch (type) {
		case ToastType.INFO : {
			return toast.info;
		}
		case ToastType.SUCCESS : {
			return toast.success;
		}
		case ToastType.ERROR : {
			return toast.error;
		}
		case ToastType.WARN : {
			return toast.warn
		}
		default: {
			return toast.info;
		}
	}
}

export const MinToastOptions : ToastOptions = {
	autoClose: false,
	hideProgressBar: true,
	draggable: false,
	position: 'top-right'
}

interface INotifyContent {
	message: string;
	actionName?: string;
	actionHandler?: () => void;
}

export const NotificationContent: React.FC<INotifyContent> = ({message, actionName, actionHandler}) => {
	return (
		<div className='d-flex gap-2 align-items-center'>
			<p className='mb-0'>{message}</p>
			{actionHandler &&
				<button
					onClick={actionHandler}
				    className='py-1'
					style={{ fontSize: '14px', fontWeight: 'normal', color: 'black' }}
				>{actionName}
				</button>}
		</div>
	)
}


