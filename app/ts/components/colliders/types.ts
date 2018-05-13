

export interface IStore {
    colliders: Data[];
    add: (el: Data) => void;
}

export interface Collider extends Data {
    position: { x: number, y: number };
}

export interface Data {
    state: { color: string };
    name?: string;
}
