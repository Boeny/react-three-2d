import * as React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { MountAndInit } from '~/components/mount-and-init';
import { Particle } from './particles';


export const Store = {
    state: observable({
        x: 0,
        y: 0
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


export const update = action((sign: number) => {
    Store.state.y += sign;
});


export const Body = observer((props: PositionProps) => {
    const pos = props.position || { x: 0, y: 0 };
    return (
        <MountAndInit
            component={<Particle {...Store.state} />}
            onMount={() => init(pos.x, pos.y)}
        />
    );
});
