import React from 'react';
import BannerButton from '../components/BannerButton';
import { useNavigate } from 'react-router-dom';

const { ipcRenderer } = window.electron;

const LabelToLink: { [index: string]: any } = {
	'Git Account': '/account',
	'Git Init': '/create_repo',
	'Git Modify': '/modify_repo',
	'Git Clone': '/clone_repo'
};


const LandingPage: React.FC = () => {

	const navigate = useNavigate();

	const onClickBannerButton = (label: string) => {
		navigate(LabelToLink[label]);
	};

	return (
		<div className='landing-bg pt-5'>
			<section className='container pt-5'>
				<h3 className='text-center mb-5'>Welcome to Git Wind</h3>
				<div className='d-flex flex-row justify-content-around w-100 py-5'>
					<BannerButton onClick={onClickBannerButton} label='Git Account' />
					<BannerButton onClick={onClickBannerButton} label='Git Init' />
					<BannerButton onClick={onClickBannerButton} label='Git Modify' />
					<BannerButton onClick={onClickBannerButton} label='Git Clone' />
				</div>
			</section>
		</div>
	);
};

export default LandingPage;
