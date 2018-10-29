import * as React from 'react';
import { Vector3 } from 'three';
import { observer } from 'mobx-react';
import { observable, runInAction } from 'mobx';
import { Store as movable } from './movable/store';
import { getSelectedObject } from '~/utils';
import { MountAndInit } from './mount-and-init';
import { Cube } from './cube';


const INITIAL_BULLET_SPEED = 1;


interface BulletType {
    position: Vector3;
    rotation: Vector3;
    velocity: Vector3;
    rotVelocity: Vector3;
}

interface IStore {
    state: {
        data: BulletType[];
    };
    initPosition: Vector3;
    parentVelocity: Vector3;
    direction: Vector3;
    init: (props: Props) => void;
    add: () => void;
    removeExploded: () => void;
}

export const Store: IStore = {
    state: observable({
        data: []
    }),
    initPosition: new Vector3(),
    parentVelocity: new Vector3(),
    direction: new Vector3(),
    init({ position, velocity, direction }: Props) {
        this.initPosition = position.clone();
        this.parentVelocity = velocity.clone();
        this.direction = direction.clone();
    },
    add() {
        runInAction(() => {
            this.state.data.push({
                position: this.initPosition.clone(),
                velocity: this.direction.clone().multiplyScalar(INITIAL_BULLET_SPEED)
                    .add(this.parentVelocity),
                rotation: new Vector3(),
                rotVelocity: new Vector3()
            });
        });
    },
    removeExploded() {
        runInAction(() => {
            this.state.data = this.state.data.filter(
                item => getSelectedObject(item.position, item.velocity) !== null
            );
        });
    }
};


const BulletsComponent = observer(() => {
    return (
        <group>
            {Store.state.data.map(item => (
                <Bullet bullet={item} />
            ))}
        </group>
    );
});


interface Props {
    position: Vector3;
    velocity: Vector3;
    direction: Vector3;
}

export class Bullets extends React.Component<Props> {

    componentDidUpdate() {
        Store.init(this.props);
    }

    render() {
        return (
            <MountAndInit
                component={<BulletsComponent />}
                onMount={() => {
                    Store.init(this.props);
                    movable.add({ onEveryTick });
                }}
            />
        );
    }
}

function onEveryTick() {
    // check for explosion in the next frame
    // Store.removeExploded();
    // change position by velocity

    // change rotation by rotation velocity

}


interface BulletProps {
    bullet: BulletType;
}

const Bullet = observer((props: BulletProps) => {
    const { bullet } = props;
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
