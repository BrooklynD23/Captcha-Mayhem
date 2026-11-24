import { useRouter } from 'expo-router';
import { Button, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useGameHearts } from '../hooks/use-game-hearts';
import { useGameTimer } from '../hooks/use-game-timer';

import { LivesTimerHud } from '../components/game/lives-timer-hud';

export default function TimerTestScreen() {
	const router = useRouter();

	function goToEndScreen() {
		// change this route when the team's end screen is ready
		router.replace('/timer-test-end');
	}

	const timer = useGameTimer({ onTimeUp: goToEndScreen });
	const lives = useGameHearts({
		onHeartLost: () => timer.addTime(3),
		onOutOfHearts: () => {
			timer.stopTimer();
			goToEndScreen();
		},
	});

	return (
		<SafeAreaView style={{ flex: 1, padding: 24, gap: 12, backgroundColor: 'white' }}>
			<LivesTimerHud
				hearts={lives.hearts}
				maxHearts={lives.maxHearts}
				secondsLeft={timer.secondsLeft}
			/>

			<Button
				title="Start or restart"
				onPress={() => {
					lives.resetHearts();
					timer.startTimer();
				}}
			/>
			<Button
				title="Test wrong tile"
				onPress={() => {
					if (timer.isTimerRunning()) lives.loseHeart();
				}}
			/>
			<Button
				title="Test next level"
				onPress={() => {
					if (timer.isTimerRunning()) timer.resetTimer();
				}}
			/>
		</SafeAreaView>
	);
}