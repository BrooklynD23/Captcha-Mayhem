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

	return ( // controlling where the timer and heart systems go is up to the team, but this is a good example of how to use them together
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

// todo use this temporary route to test the hearts, countdown and game over
// on web, add both test routes inside TabList in src/components/app-tabs.web.tsx
// put the two temporary TabTrigger entries after the Explore entry
// delete this file once the real game screen uses the hooks and hud
// also a good example of how to use react overall to manage game state and transitions between screens