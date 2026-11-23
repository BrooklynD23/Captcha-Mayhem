import { useState } from 'react';
import { StyleSheet, View, type LayoutChangeEvent } from 'react-native';

import { ColorTile } from '@/components/game/color-tile';
import { TILE_GAP } from '@/constants/game';

export type ColorGridProps = {
  rows: number;
  cols: number;
  baseColor: string;
  oddColor: string;
  oddIndex: number;
  onSelect: (index: number) => void;
  /** Index of the last wrong tap, or null. */
  wrongIndex: number | null;
  /** Increments per wrong tap so the same tile can shake again. */
  wrongCount: number;
};

/**
 * Lays out rows × cols square tiles that always fit the space the parent gives it
 * ("constraints go down, sizes go up" — L04). Tile size is measured, never hard-coded.
 */
export function ColorGrid({
  rows,
  cols,
  baseColor,
  oddColor,
  oddIndex,
  onSelect,
  wrongIndex,
  wrongCount,
}: ColorGridProps) {
  const [box, setBox] = useState({ width: 0, height: 0 });

  const onLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width !== box.width || height !== box.height) setBox({ width, height });
  };

  const tileSize = Math.max(
    0,
    Math.floor(
      Math.min((box.width - TILE_GAP * (cols - 1)) / cols, (box.height - TILE_GAP * (rows - 1)) / rows),
    ),
  );
  const total = rows * cols;

  return (
    <View style={styles.container} onLayout={onLayout}>
      {tileSize > 0 && (
        <View style={[styles.grid, { width: tileSize * cols + TILE_GAP * (cols - 1) }]}>
          {Array.from({ length: total }, (_, i) => (
            <ColorTile
              key={i}
              index={i}
              total={total}
              size={tileSize}
              color={i === oddIndex ? oddColor : baseColor}
              onPress={onSelect}
              shakeKey={i === wrongIndex ? wrongCount : null}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: TILE_GAP,
  },
});
