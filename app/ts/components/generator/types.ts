import { Position } from '~/types';


export { Signal } from '~/components/body/types';

export interface IStore {
    timer: number;
    state: { tick: boolean };
    position: Position;
    setPosition: (v: Position) => void;
    timerAfterTickStart: () => boolean;
    updateTimer: () => void;
    setTick: (tick: boolean) => void;
}
