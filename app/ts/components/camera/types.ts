import { Vector2 } from 'three';

export interface State {
    zoom: number;
    position: Vector2;
}

export interface IStore {
    state: State;
    velocity: Vector2;
    setSpeed: (v: Vector2) => void;
    updateConnected: (v: Vector2) => void;
    setZoom: (newZoom: number) => void;
    setPosition: (v: Vector2) => void;
    connected?: ConnectedStore;
}

interface ConnectedStore {
    position: { x: number, y: number };
    velocity: Vector2;
    update: (v: Vector2) => void;
}
