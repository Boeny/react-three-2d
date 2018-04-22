import * as React from 'react';
import { Vector3 } from 'three';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { Particle } from './particles';


export interface IStore {
    state: {
        x: number;
        y: number;
        left: boolean;
        right: boolean;
        top: boolean;
        bottom: boolean;
    };
    x: number;
    y: number;
    velocity: number;
    updateX: (sign: number) => void;
    updateY: (sign: number) => void;
    setCollision: (target: string, value: boolean) => void;
}

export const Store: IStore[] = [];

const getStore = (p?: Vector3): IStore => ({
    state: observable({
        x: p ? p.x : 0,
        y: p ? p.y : 0,
        left: false,
        right: false,
        top: false,
        bottom: false
    }),
    x: p ? p.x : 0,
    y: p ? p.y : 0,
    velocity: 0,
    updateX: () => { },
    updateY: () => { },
    setCollision: () => { }
});


const updateX = (store: IStore) => (sign: number) => {
    store.state.x += sign;
};


const updateY = (store: IStore) => (sign: number) => {
    store.state.y += sign;
};


const setCollision = (store: IStore) => (target: string, value: boolean) => {
    const { state } = store;
    switch (target) {
        case 'left':
            if (state.left !== value) {
                state.left = value;
            }
            break;
        case 'right':
            if (state.right !== value) {
                state.right = value;
            }
            break;
        case 'top':
            if (state.top !== value) {
                state.top = value;
            }
            break;
        case 'bottom':
            if (state.bottom !== value) {
                state.bottom = value;
            }
            break;
    }
};


const getConnected = (store: IStore) => observer(() => {
    const { x, y, left, right, top, bottom } = store.state;
    return (
        <group>
            <Particle {...store.state} />
            {left ? <Particle x={x + 1} y={y} color={'red'} /> : null}
            {right ? <Particle x={x - 1} y={y} color={'red'} /> : null}
            {top ? <Particle x={x} y={y + 1} color={'red'} /> : null}
            {bottom ? <Particle x={x} y={y - 1} color={'red'} /> : null}
        </group>
    );
});


export function Body(props: PositionProps) {
    const store = getStore(props.position);
    store.updateX = action(updateX(store));
    store.updateY = action(updateY(store));
    store.setCollision = action(setCollision(store));
    console.log('store creation');
    Store.push(store);
    const Connected = getConnected(store);
    return <Connected />;
}
