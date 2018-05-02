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
    mass: number;
    distanceToParent: number;
    parent?: Position;
    force?: Position;
    bounceLine?: number;
    bounce?: number;
    connections?: IStore[];
    target?: Position;
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
    mass: 1,
    distanceToParent: 0
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
export function setStatic(x: number, y: number, store: IStore) {
    return Static[`${x}|${y}`] = store;
}
export function delStatic(x: number, y: number) {
    delete Static[`${x}|${y}`];
}

interface Props extends PositionProps {
    parent?: Position;
    force?: Position;
    mass?: number;
    bounceLine?: number;
    connected?: boolean;
}

export function Body(props: Props) {
    const { position, parent, force, mass, bounceLine, connected } = props;
    const store = getStore(position);
    store.updateX = action(updateX(store));
    store.updateY = action(updateY(store));
    store.setCollision = action(setCollision(store));
    if (mass) {
        store.mass = mass;
    }
    if (bounceLine) {
        store.bounceLine = bounceLine;
    }
    if (connected) {
        const prev = Bodies[Bodies.length - 1];
        store.connections = [];
        if (prev && prev.connections) {
            prev.connections.push(store);
            store.connections.push(prev);
        }
    }
    if (parent) {
        store.parent = parent;
    }
    if (store.parent) {
        const dx = store.parent.x - store.x;
        const dy = store.parent.y - store.y;
        store.distanceToParent = Math.sqrt(dx * dx + dy * dy);
    }
    if (force) {
        store.force = force;
    } else {
        Static[position ? `${position.x}|${position.y}` : '0|0'] = store;
    }
    Bodies.push(store);
    return <Connected {...store} />;
}
