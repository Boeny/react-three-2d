import * as React from 'react';
import { Vector3 } from 'three';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { Particle } from './particles';


export interface Position {
    x: number;
    y: number;
}

interface State extends Position {
    left: boolean;
    right: boolean;
    top: boolean;
    bottom: boolean;
}

export interface IStore extends Position {
    state: State;
    velocity: Position;
    updateX: (sign: number) => void;
    updateY: (sign: number) => void;
    setCollision: (target: string, value: boolean) => void;
    distanceToParent: number;
    parent?: Position;
}

export const Bodies: IStore[] = [];
export const Static: { [coo: string]: IStore } = {};

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
    velocity: { x: 0, y: 0 },
    updateX: () => { },
    updateY: () => { },
    setCollision: () => { },
    distanceToParent: 0,
    parent: undefined
});


const updateX = (store: IStore) => (dx: number) => {
    store.state.x += dx;
};


const updateY = (store: IStore) => (dy: number) => {
    store.state.y += dy;
};


const setCollision = (store: IStore) => (target: string, value: boolean) => {
    const { state } = store;
    if (!target) {
        if (state.left !== false) {
            state.left = false;
        }
        if (state.right !== false) {
            state.right = false;
        }
        if (state.top !== false) {
            state.top = false;
        }
        if (state.bottom !== false) {
            state.bottom = false;
        }
        return;
    }
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


const Connected = observer((store: IStore) => {
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


export function getStatic(x: number, y: number): IStore | undefined {
    return Static[`${x}|${y}`];
}

export function Body(props: PositionProps & { parent?: Position, isStatic?: boolean }) {
    const { position, parent, isStatic } = props;
    const store = getStore(position);
    store.updateX = action(updateX(store));
    store.updateY = action(updateY(store));
    store.setCollision = action(setCollision(store));
    store.parent = parent || Bodies[Bodies.length - 1];
    if (store.parent) {
        const dx = store.parent.x - store.x;
        const dy = store.parent.y - store.y;
        store.distanceToParent = Math.sqrt(dx * dx + dy * dy);
    }
    if (isStatic) {
        Static[position ? `${position.x}|${position.y}` : '0|0'] = store;
    } else {
        Bodies.push(store);
    }
    return <Connected {...store} />;
}
