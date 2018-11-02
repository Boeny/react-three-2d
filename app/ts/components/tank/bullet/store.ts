import { Vector3 } from 'three';
import { observable, action } from 'mobx';
import { getSelectedObject } from '~/utils';
import { InitialParams, IStore } from './types';


const INITIAL_BULLET_SPEED = 0.9;
const GRAVITY_FORCE = 0;


export class Store implements IStore {
    @observable
    state: IStore['state'] = { data: [] };

    initPosition = new Vector3();
    velocity = new Vector3();
    rotation = new Vector3();

    init({ position, velocity, direction, rotation }: InitialParams) {
        this.initPosition = position.clone();
        this.velocity = direction.clone().normalize().multiplyScalar(INITIAL_BULLET_SPEED)
            .add(velocity);
        this.rotation = rotation.clone();
    }

    @action
    add() {
        this.state.data.push({
            position: this.initPosition.clone(),
            velocity: this.velocity.clone(),
            rotation: this.rotation.clone(),
            rotVelocity: new Vector3()
        });
    }

    @action
    removeExploded() {
        this.state.data = this.state.data.filter(
            item => item.position.clone().sub(this.initPosition).length() < 50
                && getSelectedObject(item.position, item.velocity) === null // .multiplyScalar(deltaTime)
        );
    }

    @action
    updatePosition(deltaTime: number) {
        this.state.data = this.state.data.map(item => {
            const velocity = item.velocity.clone();
            velocity.z -= GRAVITY_FORCE;
            return {
                ...item,
                position: velocity.multiplyScalar(deltaTime).add(item.position)
            };
        });
    }
}
