import { useCallback, useEffect, useEffectEvent, useRef, useState } from 'react';

type GameTimerOptions = {
    levelSeconds?: number;

    // pass the team's game over function here from the game screen
    onTimeUp?: () => void; // useGameTimer({ onTimeUp: endGame }) change to something like this
};

export function useGameTimer({ levelSeconds = 15, onTimeUp }: GameTimerOptions = {}) {
    const [secondsLeft, setSecondsLeft] = useState(0);
    const deadline = useRef<number | null>(null);

    const notifyTimeUp = useEffectEvent(() => {
        onTimeUp?.();
    });

    const isTimerRunning = useCallback(() => {
        return deadline.current !== null && deadline.current > Date.now();
    }, []);

    const resetTimer = useCallback(() => {
        deadline.current = Date.now() + levelSeconds * 1000;
        setSecondsLeft(levelSeconds);
    }, [levelSeconds]);

    const stopTimer = useCallback(() => {
        deadline.current = null;
    }, []);

    const addTime = useCallback((seconds: number) => {
        const now = Date.now();
        if (deadline.current === null || deadline.current <= now) return;

        deadline.current += seconds * 1000;
        setSecondsLeft(Math.ceil((deadline.current - now) / 1000));
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            if (deadline.current === null) return;

            const remaining = Math.max(0, Math.ceil((deadline.current - Date.now()) / 1000));
            setSecondsLeft(remaining);

            if (remaining === 0) {
                stopTimer();
                notifyTimeUp();
            }
        }, 100);

        return () => {
            clearInterval(interval);
            stopTimer();
        };
    }, [stopTimer]);

    return {
        secondsLeft,

        // call from Start Game once the first board is ready
        startTimer: resetTimer,

        // call once the next level is ready to play
        resetTimer,

        // call addTime(3) from the hearts hook when a life remains
        addTime,

        // call when the player loses the last heart
        stopTimer,

        // check before accepting a tile tap
        isTimerRunning,
    };
}