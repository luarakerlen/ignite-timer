import styled from 'styled-components';

export const HomeContainer = styled.main`
	flex: 1;
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;

	form {
		display: flex;
		flex-direction: column;
		align-items: center;
		gap: 3.5rem;
	}
`;

const BaseCountdownButton = styled.button`
	width: 100%;
	border: 0;
	border-radius: 8px;
	padding: 1rem;
	cursor: pointer;

	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.5rem;
	font-weight: bold;

	color: ${(props) => props.theme['gray-100']};
	transition: background-color 0.2s;

	&:disabled {
		opacity: 0.7;
		cursor: not-allowed;
	}
`;

export const StartCountdownButton = styled(BaseCountdownButton)`
	background-color: ${(props) => props.theme['green-500']};

	&:not(:disabled):hover {
		background-color: ${(props) => props.theme['green-700']};
	}
`;

export const StopCountdownButton = styled(BaseCountdownButton)`
	background-color: ${(props) => props.theme['red-500']};

	&:not(:disabled):hover {
		background-color: ${(props) => props.theme['red-700']};
	}
`;
