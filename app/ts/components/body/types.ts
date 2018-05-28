import { Vector2 } from 'three';


export interface Position {
    x: number;
    y: number;
}

interface Moving {
    left: boolean;
    right: boolean;
    up: boolean;
    down: boolean;
}

export interface IStore extends CommonParams {
    state: {
        color: string,
        name: string | JSX.Element | null;
    };
    position: Position;
    velocity: Vector2;
    setColor: (color: string) => void;
    setName: (name?: string | JSX.Element) => void;
    setPosition: (v: Position) => void;
    setVelocity: (v: number, coo: 'x' | 'y') => void;
    changePosition: (v: Vector2, withCollider?: boolean) => void;
    signal: (s: Signal) => void;
}

export interface CommonParams {
    isMovable?: boolean;
    onEveryTick?: (body: IStore) => void;
    onPositionChange?: (v: Position) => void;
    onVelocityChange?: (v: Vector2) => void;
    onCollide?: (collider: IStore) => void;
    onUnCollide?: () => void;
    onSignal?: (body: IStore, signal: Signal) => void;
}

export type Signal = Partial<Moving>;
