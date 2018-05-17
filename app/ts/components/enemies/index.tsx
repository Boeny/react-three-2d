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


interface Position {
    x: number;
    y: number;
}

interface IStore {
    speedVector: Vector2;
    timer: number;
    state: {
        tick: boolean;
        position: Position;
    };
    setPosition: (v: Position) => void;
}

function getStore(speedVector: Vector2): IStore {
    return {
        speedVector,
        timer: 0,
        state: observable({
            tick: false,
            position: { x: 0, y: 0 }
        }),
        setPosition(v: Position) {
            runInAction(() => {
                this.state.position = { x: v.x, y: v.y };
            });
        }
    };
}

// const V2 = new Vector2();
const OFFSET = [
    new Vector2(MAX_SPEED, 0),
    new Vector2(-MAX_SPEED, 0),
    new Vector2(0, MAX_SPEED),
    new Vector2(0, -MAX_SPEED)
];


const Enemy = observer((props: PositionProps) => {
    return (
        <group>
            {getNumArray(1).map(i => {
                const store = getStore(OFFSET[i]);// TODO: getStore must be in componentDidMount or constructor!!!
                const position = OFFSET[i].clone().multiplyScalar(-5).add(props.position);
                return (
                    <group key={i}>
                        <Body
                            name={'mover'}
                            color={'red'}
                            hasCollider={true}
                            isMovable={true}
                            position={position}
                        />
                        <Generator
                            period={20}
                            tickLength={10}
                            position={position.clone().add(OFFSET[i])}
                            onEveryTick={impulse => {
                                if (impulse) {
                                    store.setPosition(OFFSET[i]);
                                }
                            }}
                        />
                    </group>
                );
            })}
        </group>
    );
});
