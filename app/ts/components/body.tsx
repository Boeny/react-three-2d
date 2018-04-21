import * as React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { MountAndInit } from '~/components/mount-and-init';
import { Particle } from './particles';


export const Store = {
    state: observable({
        x: 0,
        y: 0,
        left: false,
        right: false,
        top: false,
        bottom: false
    }),
    x: 0,
    y: 0,
    velocity: 0
};


const init = action((x: number, y: number) => {
    Store.x = x;
    Store.y = y;
    Store.state.x = x;
    Store.state.y = y;
});


export const updateX = action((sign: number) => {
    Store.state.x += sign;
});


export const updateY = action((sign: number) => {
    Store.state.y += sign;
});


export const setCollision = action((target: string, value: boolean) => {
    const { state } = Store;
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
});


export const Body = observer((props: PositionProps) => {
    const pos = props.position || { x: 0, y: 0 };
    const { x, y, left, right, top, bottom } = Store.state;
    return (
        <MountAndInit
            component={(
                <group>
                    <Particle {...Store.state} />
                    {left ? <Particle x={x + 1} y={y} color={'red'} /> : null}
                    {right ? <Particle x={x - 1} y={y} color={'red'} /> : null}
                    {top ? <Particle x={x} y={y + 1} color={'red'} /> : null}
                    {bottom ? <Particle x={x} y={y - 1} color={'red'} /> : null}
                </group>
            )}
            onMount={() => init(pos.x, pos.y)}
        />
    );
});
