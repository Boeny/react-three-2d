import { observable, runInAction } from 'mobx';
import { IStore } from './types';


export function getStore(period: number, tickLength: number): IStore {
    const tickStart = period + 1;
    const tickEnd = period + tickLength;
    return {
        timer: 0,
        state: observable({
            tick: false
        }),
        timerEqualsTickStart() {
            return this.timer === tickStart;
        },
        updateTimer() {
            this.timer += 1;
            if (this.timer === tickEnd) {
                this.timer = 0;
            }
        },
        setTick(tick: boolean) {
            runInAction(() => {
                this.state.tick = tick;
            });
        }
    };
}
