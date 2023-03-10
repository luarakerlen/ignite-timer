import { differenceInSeconds } from 'date-fns';
import { useContext, useEffect } from 'react';
import { CyclesContext } from '../../../../contexts/CyclesContext';
import { CountdownContainer, Separator } from './styles';

export function Countdown() {
	const {
		activeCycle,
		activeCycleId,
		amountSecondsPassed,
		setSecondsPassed,
		markCurrentCycleAsFinished,
	} = useContext(CyclesContext);

	const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
	const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;
	const currentMinutesAmount = Math.floor(currentSeconds / 60);
	const currentSecondsAmount = currentSeconds % 60;
	const minutes = String(currentMinutesAmount).padStart(2, '0');
	const seconds = String(currentSecondsAmount).padStart(2, '0');

	useEffect(() => {
		let interval: number;

		if (activeCycle) {
			interval = setInterval(() => {
				const secondsDifference = differenceInSeconds(
					new Date(),
					new Date(activeCycle.startDate)
				);

				if (secondsDifference >= totalSeconds) {
					markCurrentCycleAsFinished();
					setSecondsPassed(totalSeconds);
					clearInterval(interval);
				} else {
					setSecondsPassed(secondsDifference);
				}
			}, 1000);
		}

		return () => {
			clearInterval(interval);
			setSecondsPassed(0);
		};
	}, [activeCycle, totalSeconds, activeCycleId]);

	useEffect(() => {
		if (activeCycle) {
			document.title = `${minutes}:${seconds} - ${activeCycle.task} | Ignite Timer`;
		} else {
			document.title = 'Ignite Timer';
		}
	}, [minutes, seconds]);

	return (
		<CountdownContainer>
			<span>{minutes[0]}</span>
			<span>{minutes[1]}</span>
			<Separator>:</Separator>
			<span>{seconds[0]}</span>
			<span>{seconds[1]}</span>
		</CountdownContainer>
	);
}
