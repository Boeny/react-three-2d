import { Vector2 } from 'three';


export interface Position {
    x: number;
    y: number;
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
}

export interface CommonParams {
    isMovable?: boolean;
    onEveryTick?: (body: IStore) => void;
    onPositionChange?: (v: Position) => void;
    onVelocityChange?: (v: Vector2) => void;
    onCollide?: (collider: IStore) => void;
    onUnCollide?: () => void;
}
