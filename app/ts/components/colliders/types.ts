

export interface Position {
    x: number;
    y: number;
}

export interface IStore {
    colliders: Data[];
    add: (el: Data) => void;
    del: (el: Data) => void;
}

export interface Collider {
    position: Position;
    name?: string;
    isMovable?: boolean;
}

export interface Data {
    state: { color: string };
    name?: string;
}
