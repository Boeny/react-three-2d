import * as React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { Vector2 } from 'three';
import { IStore as IBodyStore } from '~/components/body/types';
import { getNumArray } from '~/utils';
import { Body } from './body';


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
    mover: IBodyStore | null;
    timer: number;
}

const Store: IStore = observable({
    mover: null,
    timer: 0
});

const setMover = action((el: IBodyStore) => {
    Store.mover = el;
});

function Enemy() {
    return (
        <group>
            <Body
                getInstance={setMover}
                name={'mover'}
                color={'red'}
                hasCollider={true}
                position={new Vector2(20, 20)}
            />
            <Generator />
        </group>
    );
}


const Generator = observer(() => {
    const { mover } = Store;
    if (mover === null) {
        return null;
    }
    return (
        <Body
            name={'generator'}
            hasCollider={true}
            color={Store.timer > 1 ? '#ffffff' : 'lightblue'}
            position={new Vector2(mover.position.x, mover.position.y - 1)}
        />
    );
});
