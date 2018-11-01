import { Vector3 } from 'three';
import { observable, runInAction } from 'mobx';
import { getSelectedObject } from '~/utils';
import { IStore, InitialParams } from './types';


const INITIAL_BULLET_SPEED = 0.9;
const GRAVITY_FORCE = 0;


export function getStore(): IStore {
    return {
        state: observable({
            data: []
        }),
        initPosition: new Vector3(),
        parentVelocity: new Vector3(),
        direction: new Vector3(),
        rotation: new Vector3(),
        init({ position, velocity, direction, rotation }: InitialParams) {
            this.initPosition = position.clone();
            this.parentVelocity = velocity.clone();
            this.direction = direction.clone().normalize();
            this.rotation = rotation.clone();
        },
        add() {
            runInAction(() => {
                this.state.data.push({
                    position: this.initPosition.clone(),
                    velocity: this.direction.clone().multiplyScalar(INITIAL_BULLET_SPEED).add(this.parentVelocity),
                    rotation: this.rotation,
                    rotVelocity: new Vector3()
                });
            });
        },
        removeExploded() {
            runInAction(() => {
                this.state.data = this.state.data.filter(
                    item => item.position.clone().sub(this.initPosition).length() < 50
                        && getSelectedObject(item.position, item.velocity) === null // .multiplyScalar(deltaTime)
                );
            });
        },
        updatePosition(deltaTime: number) {
            runInAction(() => {
                this.state.data = this.state.data.map(item => {
                    const velocity = item.velocity.clone();
                    velocity.z -= GRAVITY_FORCE;
                    return {
                        ...item,
                        position: velocity.multiplyScalar(deltaTime).add(item.position)
                    };
                });
            });
        }
    };
}
