import React from 'react';


const BannerButton: React.FC<IProps> = (props) => {

	const onClick = () => {
		props.onClick(props.label);
	};

	return (
		<button onClick={onClick} className='gw-banner-button'>
			{props.label}
		</button>
	);
};

export default BannerButton;


interface IProps {
	label: string,
	onClick: (label: string) => void
}
