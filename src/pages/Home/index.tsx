import { Play } from 'phosphor-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as zod from 'zod';
import {
	CountdownContainer,
	FormContainer,
	HomeContainer,
	MinutesAmountInput,
	Separator,
	StartCountdownButton,
	TaskInput,
} from './styles';
import { useState } from 'react';

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

	function handleCreateNewCycle(data: NewCycleFormData) {
		const id = String(new Date().getTime());

		const newCycle: Cycle = {
			id,
			task: data.task,
			minutesAmount: data.minutesAmount,
		};

		setCycles((state) => [...state, newCycle]);
		setActiveCycleId(id);

		reset();
	}

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

	return (
		<HomeContainer>
			<form onSubmit={handleSubmit(handleCreateNewCycle)}>
				<FormContainer>
					<label htmlFor='task'>Vou trabalhar em</label>
					<TaskInput
						id='task'
						list='task-suggestions'
						placeholder='Dê um nome para o seu projeto'
						{...register('task')}
					/>
					<datalist id='task-suggestions' />

					<label htmlFor='minutesAmount'>durante</label>
					<MinutesAmountInput
						type='number'
						id='minutesAmount'
						placeholder='00'
						step={5}
						min={5}
						max={60}
						{...register('minutesAmount', { valueAsNumber: true })}
					/>

					<span>minutos.</span>
				</FormContainer>

				<CountdownContainer>
					<span>{minutes[0]}</span>
					<span>{minutes[1]}</span>
					<Separator>:</Separator>
					<span>{seconds[0]}</span>
					<span>{seconds[1]}</span>
				</CountdownContainer>

				<StartCountdownButton disabled={isSubmitDisabled} type='submit'>
					<Play size={24} />
					Começar
				</StartCountdownButton>
			</form>
		</HomeContainer>
	);
}
