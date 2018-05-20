import * as React from 'react';
import { observer } from 'mobx-react';
import { observable, runInAction } from 'mobx';
import { Vector2 } from 'three';
import { getNumArray } from '~/utils';
import { Body } from '../body';
import { Generator } from './generator';
import { MAX_SPEED } from '~/constants';


export function Enemies() {
    return (
        <group>
            {getNumArray(1).map(i => (
                <Enemy key={i} position={new Vector2(20, 15)} />
            ))}
        </group>
    );
}


function Enemy(props: PositionProps) {
    return (
        <group>
            {getNumArray(4).map(i => (
                <Mover
                    key={i}
                    offset={OFFSET[i]}
                    store={getStore()}
                    position={OFFSET[i].clone().multiplyScalar(-4).add(props.position)}
                />
            ))}
        </group>
    );
}


interface MoveProps {
    store: IStore;
    offset: Vector2;
    position: Vector2;
}

const Mover = observer((props: MoveProps) => {
    const { store, offset, position } = props;
    const velocity = new Vector2(store.velocity.x, store.velocity.y);
    return (
        <group>
            <Body
                name={'mover'}
                color={'red'}
                hasCollider={true}
                isMovable={true}
                position={position}
                velocity={velocity}
                onVelocityChange={v => store.setVelocity(v)}
            />
            <Generator
                period={20}
                tickLength={10}
                position={position.clone().add(offset)}
                onEveryTick={impulse => {
                    if (impulse) {
                        store.setVelocity(offset);
                    }
                }}
            />
        </group>
    );
});


interface Position {
    x: number;
    y: number;
}

interface IStore {
    timer: number;
    velocity: Position;
    setVelocity: (v: Vector2) => void;
}

function getStore(): IStore {
    return {
        timer: 0,
        velocity: observable({ x: 0, y: 0 }),
        setVelocity(v: Vector2) {
            runInAction(() => {
                this.velocity.x = v.x;
                this.velocity.y = v.y;
            });
        }
    };
}


const OFFSET = [
    new Vector2(MAX_SPEED, 0),
    new Vector2(-MAX_SPEED, 0),
    new Vector2(0, MAX_SPEED),
    new Vector2(0, -MAX_SPEED)
];
