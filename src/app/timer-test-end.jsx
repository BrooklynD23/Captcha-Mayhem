import { useRouter } from 'expo-router';
import { Button, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TimerTestEndScreen() {
	const router = useRouter();

	return (
		<SafeAreaView style={{ flex: 1, padding: 24, gap: 12, backgroundColor: 'white' }}>
			<Text style={{ fontSize: 28, fontWeight: 'bold' }}>Game over</Text>
			<Button
				title="Play again"
				onPress={() => router.replace('/timer-test')}
			/>
		</SafeAreaView>
	);
}

// todo delete this temporary game over screen after testing the real end screen