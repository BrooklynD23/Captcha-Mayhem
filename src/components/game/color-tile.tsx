import { useEffect, useState } from 'react';
import { AccessibilityInfo, Animated, Pressable, StyleSheet } from 'react-native';

import { TILE_RADIUS } from '@/constants/game';

export type ColorTileProps = {
  color: string;
  index: number;
  total: number;
  size: number;
  onPress: (index: number) => void;
  /** Changes every time this tile is tapped wrongly; a new value triggers the shake. */
  shakeKey: number | null;
};

const SHAKE_DISTANCE = 6;
const SHAKE_STEP_MS = 50;

export function ColorTile({ color, index, total, size, onPress, shakeKey }: ColorTileProps) {
  const [shake] = useState(() => new Animated.Value(0));

  useEffect(() => {
    if (shakeKey === null) return;
    let cancelled = false;
    AccessibilityInfo.isReduceMotionEnabled().then((reduce) => {
      if (cancelled || reduce) return;
      shake.setValue(0);
      Animated.sequence(
        [SHAKE_DISTANCE, -SHAKE_DISTANCE, SHAKE_DISTANCE, 0].map((toValue) =>
          Animated.timing(shake, { toValue, duration: SHAKE_STEP_MS, useNativeDriver: true }),
        ),
      ).start();
    });
    return () => {
      cancelled = true;
    };
  }, [shakeKey, shake]);

  return (
    <Animated.View style={{ transform: [{ translateX: shake }] }}>
      <Pressable
        onPress={() => onPress(index)}
        accessibilityRole="button"
        accessibilityLabel={`Tile ${index + 1} of ${total}`}
        style={({ pressed }) => [
          styles.tile,
          {
            width: size,
            height: size,
            backgroundColor: color,
            transform: [{ scale: pressed ? 0.94 : 1 }],
          },
        ]}
      />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderRadius: TILE_RADIUS,
    borderCurve: 'continuous',
  },
});
