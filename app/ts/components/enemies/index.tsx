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
            {getNumArray(1).map(i => (
                <Mover
                    key={i}
                    offset={OFFSET[i]}
                    store={getStore(OFFSET[i].clone().multiplyScalar(-5).add(props.position))}
                />
            ))}
        </group>
    );
}


interface Position {
    x: number;
    y: number;
}

interface IStore {
    timer: number;
    position: Position;
    velocity: Position;
    setPosition: (v: Position) => void;
    setVelocity: (v: Vector2) => void;
}

function getStore(p: Vector2): IStore {
    return {
        timer: 0,
        position: observable({ x: p.x, y: p.y }),
        velocity: observable({ x: 0, y: 0 }),
        setPosition(v: Position) {
            runInAction(() => {
                this.position.x = v.x;
                this.position.y = v.y;
            });
        },
        setVelocity(v: Vector2) {
            runInAction(() => {
                this.velocity.x = v.x;
                this.velocity.y = v.y;
            });
        }
    };
}

const V2 = new Vector2();

const OFFSET = [
    new Vector2(MAX_SPEED, 0),
    new Vector2(-MAX_SPEED, 0),
    new Vector2(0, MAX_SPEED),
    new Vector2(0, -MAX_SPEED)
];


const Mover = observer((props: { store: IStore, offset: Vector2 }) => {
    const { store, offset } = props;
    const position = new Vector2(store.position.x, store.position.y);
    const velocity = new Vector2(store.velocity.x, store.velocity.y);
    return (
        <group>
            <Body
                name={'mover'}
                color={'red'}
                hasCollider={false}
                isMovable={true}
                position={position}
                velocity={velocity}
                onPositionChange={v => store.setPosition(v)}
                onVelocityChange={v => store.setVelocity(v)}
            />
            <Generator
                period={20}
                tickLength={10}
                position={position.clone().add(offset)}
                onEveryTick={impulse => {
                    if (impulse) {
                        store.setVelocity(offset);
                    } else {
                        store.setVelocity(V2);
                    }
                }}
            />
        </group>
    );
});
