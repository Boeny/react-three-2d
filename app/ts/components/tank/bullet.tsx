import * as React from 'react';
import { Vector3 } from 'three';
import { observer } from 'mobx-react';
import { observable, runInAction } from 'mobx';
import { Store as movable } from '../movable/store';
import { getSelectedObject } from '~/utils';
import { MountAndInit } from '../mount-and-init';
import { Cube } from '../cube';


const INITIAL_BULLET_SPEED = 1;
const GRAVITY_FORCE = 0.01;

interface BulletType {
    position: Vector3;
    rotation: Vector3;
    velocity: Vector3;
    rotVelocity: Vector3;
}

export interface IStore {
    state: {
        data: BulletType[];
    };
    initPosition: Vector3;
    parentVelocity: Vector3;
    direction: Vector3;
    rotation: Vector3;
    init: (props: Props) => void;
    add: () => void;
    removeExploded: () => void;
    updatePosition: (deltaTime: number) => void;
}

function getStore(): IStore {
    return {
        state: observable({
            data: []
        }),
        initPosition: new Vector3(),
        parentVelocity: new Vector3(),
        direction: new Vector3(),
        rotation: new Vector3(),
        init({ position, velocity, direction, rotation }: Props) {
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
                this.state.data = this.state.data.map(item => ({
                    ...item,
                    position: new Vector3(
                        item.position.x + item.velocity.x * deltaTime,
                        item.position.y + item.velocity.y * deltaTime,
                        item.position.z - GRAVITY_FORCE * deltaTime
                    )
                }));
            });
        }
    };
}


const BulletsComponent = observer(({ store }: { store: IStore }) => {
    return (
        <group>
            {store.state.data.map((item, i) => (
                <Bullet key={i} bullet={item} />
            ))}
        </group>
    );
});


interface Props {
    position: Vector3;
    velocity: Vector3;
    direction: Vector3;
    rotation: Vector3;
    onRef: (store: IStore) => void;
}

export class Bullets extends React.Component<Props> {

    store = getStore();

    componentDidUpdate() {
        this.store.init(this.props);
    }

    render() {
        return (
            <MountAndInit
                component={<BulletsComponent store={this.store} />}
                onMount={() => {
                    this.store.init(this.props);
                    this.props.onRef(this.store);
                    movable.add({ onEveryTick: onEveryTick(this.store) });
                }}
            />
        );
    }
}

const onEveryTick = (store: IStore) => (deltaTime: number) => {
    // check for explosion in the next frame
    store.removeExploded();
    // change position by velocity
    store.updatePosition(deltaTime);
    // change rotation by rotation velocity
};


interface BulletProps {
    bullet: BulletType;
}

const Bullet = observer(({ bullet }: BulletProps) => {
    return (
        <Cube
            position={bullet.position}
            rotation={bullet.rotation}
            width={0.5}
            height={0.25}
            depth={0.25}
            color={'#aaaaaa'}
        />
    );
});
