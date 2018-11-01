import { Vector3 } from 'three';


export interface BulletType {
    position: Vector3;
    rotation: Vector3;
    velocity: Vector3;
    rotVelocity: Vector3;
}

export interface IStore {
    state: { data: BulletType[] };
    initPosition: Vector3;
    parentVelocity: Vector3;
    direction: Vector3;
    rotation: Vector3;
    init: (props: InitialParams) => void;
    add: () => void;
    removeExploded: () => void;
    updatePosition: (deltaTime: number) => void;
}

export interface InitialParams {
    position: Vector3;
    velocity: Vector3;
    direction: Vector3;
    rotation: Vector3;
}
