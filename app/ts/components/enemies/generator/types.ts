

export interface Position {
    x: number;
    y: number;
}

export interface IStore {
    timer: number;
    state: { tick: boolean };
    position: Position;
    setPosition: (v: Position) => void;
    timerEqualsTickStart: () => boolean;
    updateTimer: () => void;
    setTick: (tick: boolean) => void;
}

export interface CommonProps {
    onEveryTick: (impulse: boolean) => void;
}
