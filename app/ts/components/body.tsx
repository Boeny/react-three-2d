import * as React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
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


export const update = action(() => {
    const { state } = Store;
    state.y = state.y - 1;
});


export const Body = observer(() => {
    return (
        <Particle
            x={Store.state.x}
            y={Store.state.y}
        />
    );
});
