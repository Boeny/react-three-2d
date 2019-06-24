import { observable, action, reaction } from 'mobx';
import { Vector2 } from 'three';
import { IStore, Position } from './types';


export class BodyStore implements IStore {

    constructor(
        public isMovable?: boolean,
        public onCollide?: (collider: IStore) => void,
        public onUnCollide?: () => void,
        public onEveryTick?: (body: IStore) => void,
        onPositionChange?: (v: Position) => void,
        onVelocityChange?: (v: Vector2) => void
    ) {
        onPositionChange && reaction(() => this.position, onPositionChange);
        onVelocityChange && reaction(() => this.velocity, onVelocityChange);
    }

    @observable
    color: string = '';

    @observable
    name: JSX.Element | string | null = null;

    @observable
    position = { x: 0, y: 0 };

    velocity: Vector2 = new Vector2();

    @action
    setColor(color: string) {
        this.color = color;
    }

    @action
    setName(name ?: string | JSX.Element) {
        this.name = name || null;
    }

    @action
    setPosition(v: Position) {
        this.position.x = v.x;
        this.position.y = v.y;
    }

    @action
    setVelocity(v: number, coo: 'x' | 'y') {
        this.velocity[coo] = v;
    }

    @action
    changePosition(v: Vector2) {
        this.position.x += v.x;
        this.position.y += v.y;
    }
}
