import { ResponseStatus, returnDataType } from '../types/types';

export function responseHandler(data: returnDataType, alertMessage?: string): ResponseStatus {
	let msg: string | string [] = '';
	if (data.isSuccessful) {
		if (alertMessage) {
			msg = alertMessage;
		} else {
			msg = data.data;
		}
	} else {
		msg = data.error || 'Something went wrong';
	}
	return {
		message: msg,
		success: data.isSuccessful
	};
}

export function isValidGitUrl(url: string) {
	const webUriRegexPattern = /^(https?:\/\/)?(www\.)?([A-Za-z0-9.-]+|\d+\.\d+\.\d+\.\d+)\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(\.git)?$/;
	if (webUriRegexPattern.test(url)) {
		return true;
	} else {
		const sshRegexPattern = /^git@([a-zA-Z0-9.-]+):[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+(\.git)?$/;
		return sshRegexPattern.test(url);
	}

}
