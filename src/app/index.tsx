import { Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ColorGrid } from '@/components/game/color-grid';
import { GameHud } from '@/components/game/game-hud';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useOddColorGame } from '@/hooks/use-odd-color-game';
import { useTheme } from '@/hooks/use-theme';

export default function GameScreen() {
  const { state, selectTile, restart } = useOddColorGame();
  const { puzzle } = state;
  const theme = useTheme();

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <ThemedText type="smallBold" style={styles.prompt}>
          Tap the color that doesn&apos;t match.
        </ThemedText>

        <GameHud level={state.level} rows={puzzle.rows} cols={puzzle.cols} score={state.score} />

        <ColorGrid
          rows={puzzle.rows}
          cols={puzzle.cols}
          baseColor={puzzle.baseHex}
          oddColor={puzzle.oddHex}
          oddIndex={puzzle.oddIndex}
          onSelect={selectTile}
          wrongIndex={state.wrongIndex}
          wrongCount={state.wrongCount}
        />

        <ThemedText
          type="small"
          themeColor="textSecondary"
          accessibilityLiveRegion="polite"
          style={styles.feedback}>
          {state.status === 'wrong' ? 'Not that one. Try again.' : ' '}
        </ThemedText>

        <Pressable
          onPress={restart}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.restart,
            { backgroundColor: pressed ? theme.backgroundSelected : theme.backgroundElement },
          ]}>
          <ThemedText type="smallBold">Restart</ThemedText>
        </Pressable>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  safeArea: {
    flex: 1,
    maxWidth: MaxContentWidth,
    alignItems: 'center',
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.three,
    paddingBottom: BottomTabInset + Spacing.three,
  },
  prompt: {
    textAlign: 'center',
  },
  feedback: {
    minHeight: 20,
    textAlign: 'center',
  },
  restart: {
    minHeight: 44,
    paddingHorizontal: Spacing.four,
    borderRadius: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
