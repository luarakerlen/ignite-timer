import { differenceInSeconds } from 'date-fns';
import { useContext, useEffect, useState } from 'react';
import { CyclesContext } from '../..';
import { CountdownContainer, Separator } from './styles';

export function Countdown() {
	const {
		activeCycle,
		activeCycleId,
		markCurrentCycleAsFinished,
		setActiveCycleIdAsNull,
	} = useContext(CyclesContext);

	const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

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
					activeCycle.startDate
				);

				if (secondsDifference >= totalSeconds) {
					markCurrentCycleAsFinished();
					setAmountSecondsPassed(totalSeconds);
					clearInterval(interval);
					setActiveCycleIdAsNull();
				} else {
					setAmountSecondsPassed(secondsDifference);
				}
			}, 1000);
		}

		return () => {
			clearInterval(interval);
			setAmountSecondsPassed(0);
		};
	}, [
		activeCycle,
		totalSeconds,
		activeCycleId,
		markCurrentCycleAsFinished,
		setActiveCycleIdAsNull,
	]);

	useEffect(() => {
		if (activeCycle) {
			document.title = `${minutes}:${seconds} - ${activeCycle.task} | Ignite Timer`;
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
