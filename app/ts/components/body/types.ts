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

export interface IStore {
    color: string;
    name: string | JSX.Element | null;
    position: Position;
    velocity: Vector2;
    setColor: (color: string) => void;
    setName: (name?: string | JSX.Element) => void;
    setPosition: (v: Position) => void;
    setVelocity: (v: number, coo: 'x' | 'y') => void;
    changePosition: (v: Vector2, withCollider?: boolean) => void;
    isMovable?: boolean;
    onEveryTick?: (body: IStore) => void;
    onCollide?: (collider: IStore) => void;
    onUnCollide?: () => void;
}

export interface InitialParams {
    color: string;
    position: Vector2;
    velocity?: Vector2;
    name?: string | JSX.Element;
    isMovable?: boolean;
    onEveryTick?: (body: IStore) => void;
    onPositionChange?: (v: Position) => void;
    onVelocityChange?: (v: Vector2) => void;
    onCollide?: (collider: IStore) => void;
    onUnCollide?: () => void;
}

export type Signal = Partial<Moving>;
