import { Image, StyleSheet, Text, View } from 'react-native';

const heartSprite = require('../../../assets/images/life-heart.png');

export function LivesTimerHud({ hearts, maxHearts, secondsLeft }) {
	return (
		<View style={styles.row}>
			<View
				accessible
				accessibilityLabel={`${hearts} of ${maxHearts} lives left`}
				style={styles.hearts}
			>
				{Array.from({ length: maxHearts }, (_, index) => (
					<Image
						key={index}
						source={heartSprite}
						resizeMode="contain"
						style={[styles.heart, index >= hearts && styles.lostHeart]}
					/>
				))}
			</View>

			<Text style={styles.timer}>Time: {secondsLeft}s</Text>
		</View>
	);
}

const styles = StyleSheet.create({
	row: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: 12,
		borderRadius: 12,
		backgroundColor: '#202026',
	},
	hearts: {
		flexDirection: 'row',
		gap: 8,
	},
	heart: {
		width: 28,
		height: 28,
	},
	lostHeart: {
		opacity: 0.25,
	},
	timer: {
		color: 'white',
		fontSize: 18,
		fontWeight: '600',
		fontVariant: ['tabular-nums'],
	},
});