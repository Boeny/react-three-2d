

export interface IStore {
    colliders: ReducedCollider[];
    add: (el: ReducedCollider) => void;
}

export interface Collider {
    position: { x: number, y: number };
    color: string;
    name?: string;
}

export interface ReducedCollider {
    name: string;
    color: string;
}
