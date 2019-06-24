

export { Signal } from '~/components/body/types';

export interface Position {
    x: number;
    y: number;
}

export interface IStore {
    tick: boolean;
    position: Position;
    readonly isTimerAfterTickStart: boolean;
    setPosition: (x: number, y: number) => void;
    updateTimer: () => void;
    setTick: (tick: boolean) => void;
}
