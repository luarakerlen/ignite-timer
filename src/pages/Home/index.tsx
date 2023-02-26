import { useEffect, useState } from 'react';
import { differenceInSeconds } from 'date-fns';
import { HandPalm, Play } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import { NewCycleForm } from './components/NewCycleForm';
import { Countdown } from './components/Countdown';
import {
	HomeContainer,
	StartCountdownButton,
	StopCountdownButton,
} from './styles';

const newCycleFormValidationSchema = zod.object({
	task: zod.string().min(1, 'Informe a tarefa'),
	minutesAmount: zod
		.number()
		.min(5, 'O ciclo precisa ser de o mínimo 5 minutos')
		.max(60, 'O ciclo precisa ser de o máximo 60 minutos'),
});

type NewCycleFormData = zod.infer<typeof newCycleFormValidationSchema>;

interface Cycle {
	id: string;
	task: string;
	minutesAmount: number;
	startDate: Date;
	interruptedDate?: Date;
	finishedDate?: Date;
}

export function Home() {
	const [cycles, setCycles] = useState<Cycle[]>([]);
	const [activeCycleId, setActiveCycleId] = useState<string | null>(null);
	const [amountSecondsPassed, setAmountSecondsPassed] = useState(0);

	const { register, handleSubmit, watch, reset, formState } =
		useForm<NewCycleFormData>({
			resolver: zodResolver(newCycleFormValidationSchema),
			defaultValues: {
				task: '',
			},
		});
	// console.log(formState.errors);

	const activeCycle = cycles.find((cycle) => cycle.id === activeCycleId);
	const totalSeconds = activeCycle ? activeCycle.minutesAmount * 60 : 0;
	const currentSeconds = activeCycle ? totalSeconds - amountSecondsPassed : 0;
	const currentMinutesAmount = Math.floor(currentSeconds / 60);
	const currentSecondsAmount = currentSeconds % 60;

	const minutes = String(currentMinutesAmount).padStart(2, '0');
	const seconds = String(currentSecondsAmount).padStart(2, '0');

	const task = watch('task');
	const minutesAmount = watch('minutesAmount');
	const isSubmitDisabled = !task || !minutesAmount;

	useEffect(() => {
		let interval: number;

		if (activeCycle) {
			interval = setInterval(() => {
				const secondsDifference = differenceInSeconds(
					new Date(),
					activeCycle.startDate
				);

				if (secondsDifference >= totalSeconds) {
					setCycles((state) =>
						state.map((cycle) => {
							if (cycle.id === activeCycleId) {
								return { ...cycle, finishedDate: new Date() };
							} else {
								return cycle;
							}
						})
					);

					setAmountSecondsPassed(totalSeconds);
					clearInterval(interval);
				} else {
					setAmountSecondsPassed(secondsDifference);
				}
			}, 1000);
		}

		return () => {
			clearInterval(interval);
			setAmountSecondsPassed(0);
		};
	}, [activeCycle, totalSeconds, activeCycleId]);

	function handleCreateNewCycle(data: NewCycleFormData) {
		const id = String(new Date().getTime());

		const newCycle: Cycle = {
			id,
			task: data.task,
			minutesAmount: data.minutesAmount,
			startDate: new Date(),
		};

		setCycles((state) => [...state, newCycle]);
		setActiveCycleId(id);

		reset();
	}

	function handleInterruptCycle() {
		setCycles((state) =>
			state.map((cycle) => {
				if (cycle.id === activeCycleId) {
					return { ...cycle, interruptedDate: new Date() };
				} else {
					return cycle;
				}
			})
		);

		setActiveCycleId(null);
	}

	useEffect(() => {
		if (activeCycle) {
			document.title = `${minutes}:${seconds} - ${activeCycle.task} | Ignite Timer`;
		}
	}, [minutes, seconds]);

	return (
		<HomeContainer>
			<form onSubmit={handleSubmit(handleCreateNewCycle)}>
				<NewCycleForm />
				<Countdown />

				{activeCycle ? (
					<StopCountdownButton onClick={handleInterruptCycle} type='button'>
						<HandPalm size={24} />
						Interromper
					</StopCountdownButton>
				) : (
					<StartCountdownButton disabled={isSubmitDisabled} type='submit'>
						<Play size={24} />
						Começar
					</StartCountdownButton>
				)}
			</form>
		</HomeContainer>
	);
}
