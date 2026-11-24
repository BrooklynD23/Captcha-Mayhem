import { useCallback, useRef, useState } from 'react';

type GameHeartsOptions = {
    maxHearts?: number;
    onHeartLost: () => void;
    onOutOfHearts: () => void;
};

export function useGameHearts({
    maxHearts = 3,
    onHeartLost,
    onOutOfHearts,
}: GameHeartsOptions) {
    const [hearts, setHearts] = useState(maxHearts);
    const remainingHearts = useRef(maxHearts);

    const loseHeart = useCallback(() => {
        if (remainingHearts.current === 0) return;

        remainingHearts.current -= 1;
        setHearts(remainingHearts.current);

        if (remainingHearts.current === 0) {
            onOutOfHearts();
        } else {
            onHeartLost();
        }
    }, [onHeartLost, onOutOfHearts]);

    const resetHearts = useCallback(() => {
        remainingHearts.current = maxHearts;
        setHearts(maxHearts);
    }, [maxHearts]);

    return { hearts, maxHearts, loseHeart, resetHearts };
}

// todo in the real game screen
// call lives.resetHearts() when starting or restarting a game
// call lives.loseHeart() from the wrong tile handler
// connect onHeartLost to timer.addTime(3)
// connect onOutOfHearts to timer.stopTimer() and the team's game over function