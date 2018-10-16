import { observable, runInAction } from 'mobx';
import { Vector2 } from 'three';
import { IStore } from './types';


export function getStore(period: number, tickLength: number, p: Vector2): IStore {
    const tickStart = period + 1;
    const tickEnd = period + tickLength;
    return {
        timer: 0,
        state: observable({
            tick: false
        }),
        position: observable({ x: p.x, y: p.y }),
        setPosition(v: Position) {
            runInAction(() => {
                this.position.x = v.x;
                this.position.y = v.y;
            });
        },
        timerAfterTickStart() {
            return this.timer >= tickStart;
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
