import { observable, action } from 'mobx';
import { Vector2 } from 'three';
import { IStore } from './types';


export class GeneratorStore implements IStore {

    private tickStart = 0;
    private tickEnd = 0;
    private timer = 0;

    constructor(period: number, tickLength: number, p: Vector2) {
        this.tickStart = period + 1;
        this.tickEnd = period + tickLength;
        this.setPosition(p.x, p.y);
    }

    @observable
    tick: boolean = false;

    @observable
    position = { x: 0, y: 0 };

    @action
    setPosition(x: number, y: number) {
        this.position.x = x;
        this.position.y = y;
    }

    get isTimerAfterTickStart(): boolean {
        return this.timer >= this.tickStart;
    }

    @action
    updateTimer() {
        this.timer += 1;
        if (this.timer === this.tickEnd) {
            this.timer = 0;
        }
    }

    @action
    setTick(tick: boolean) {
        this.tick = tick;
    }
}
