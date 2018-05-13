import * as React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { Vector2 } from 'three';
import { IStore as IBodyStore } from '~/components/body/types';
import { getNumArray } from '~/utils';
import { Body } from './body';
import { MAX_SPEED } from '~/constants';


export function Enemies() {
    return (
        <group>
            {getNumArray(1).map(i => (
                <Enemy key={i} />
            ))}
        </group>
    );
}


interface IStore {
    state: {
        tick: boolean;
        mover: IBodyStore | null;
        position: { x: number, y: number };
    };
    timer: number;
}

const Store: IStore = {
    state: observable({
        tick: false,
        mover: null,
        position: { x: 0, y: 0 }
    }),
    timer: 0
};


const setMover = action((el: IBodyStore) => {
    Store.state.mover = el;
    setPosition(el.position);
});

const setPosition = action((v: { x: number, y: number }) => {
    Store.state.position = { x: v.x, y: v.y };
});

const checkTickByTimer = action(() => {
    Store.timer += 1;
    if (Store.timer > 30) {
        Store.state.tick = false;
        Store.timer = 0;
        return;
    }
    if (Store.timer > 20) {
        if (Store.state.tick) {
            if (Store.state.mover) {
                Store.state.mover.velocity.y = 0;
            }
        } else {
            Store.state.tick = true;
            if (Store.state.mover) {
                Store.state.mover.velocity.y = -MAX_SPEED;
            }
        }
    }
});


function Enemy() {
    return (
        <group>
            <Body
                getInstance={setMover}
                name={'mover'}
                color={'red'}
                hasCollider={true}
                isMovable={true}
                onEveryTick={checkTickByTimer}
                afterUpdate={setPosition}
                position={new Vector2(20, 20)}
            />
            <Generator />
        </group>
    );
}


const Generator = observer(() => {
    const { mover, tick, position } = Store.state;
    if (mover === null) {
        return null;
    }
    return (
        <Body
            name={'generator'}
            color={tick ? '#ffffff' : '#49b4d0'}
            position={new Vector2(position.x, position.y - 1)}
        />
    );
});
