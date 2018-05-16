import { Vector2 } from 'three';


export interface IStore {
    timer: number;
    state: { tick: boolean };
    timerEqualsTickStart: () => boolean;
    updateTimer: () => void;
    setTick: (tick: boolean) => void;
}

export interface CommonProps {
    position: Vector2;
    onEveryTick: (impulse: boolean) => void;
}
