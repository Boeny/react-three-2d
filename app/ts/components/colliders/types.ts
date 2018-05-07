

export interface IStore {
    colliders: {
        name: string;
        color: string;
    }[];
}

export interface Collider {
    position: { x: number, y: number };
    color: string;
    name?: string;
}
