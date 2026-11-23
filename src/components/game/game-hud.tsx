import { StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';

export type GameHudProps = {
  /** 0-based level; displayed as level + 1. */
  level: number;
  rows: number;
  cols: number;
  score: number;
};

export function GameHud({ level, rows, cols, score }: GameHudProps) {
  return (
    <View style={styles.row}>
      <Stat label="Level" value={String(level + 1)} />
      <Stat label="Grid" value={`${rows}×${cols}`} />
      <Stat label="Score" value={String(score)} />
    </View>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.stat} accessible accessibilityLabel={`${label} ${value}`}>
      <ThemedText type="small" themeColor="textSecondary" style={styles.label}>
        {label}
      </ThemedText>
      <ThemedText type="subtitle" style={styles.value}>
        {value}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignSelf: 'stretch',
    gap: Spacing.three,
  },
  stat: {
    alignItems: 'center',
    flex: 1,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  value: {
    fontVariant: ['tabular-nums'],
  },
});
