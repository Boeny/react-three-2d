import * as React from 'react';
// import { observer } from 'mobx-react';
import { observable, runInAction } from 'mobx';
import { Vector2 } from 'three';
import { IStore as IBodyStore } from '~/components/body/types';
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
        mover: IBodyStore | null;
        position: Position;
    };
    setMover: (el: IBodyStore) => void;
    setPosition: (v: Position) => void;
}

function getStore(speedVector: Vector2): IStore {
    return {
        speedVector,
        timer: 0,
        state: observable({
            tick: false,
            mover: null,
            position: { x: 0, y: 0 }
        }),
        setMover(el: IBodyStore) {
            runInAction(() => {
                this.state.mover = el;
            });
            this.setPosition(el.position);
        },
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


function Enemy(props: PositionProps) {
    return (
        <group>
            {getNumArray(1).map(i => {
                const store = getStore(OFFSET[i]);
                const position = props.position.clone()
                    .add(OFFSET[i])
                    .multiplyScalar(-5);
                return (
                    <group key={i}>
                        <Body
                            getInstance={body => store.setMover(body)}
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
                            onEveryTick={() => {}}
                        />
                    </group>
                );
            })}
        </group>
    );
}
