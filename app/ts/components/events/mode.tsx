import * as React from 'react';
import { Vector2 } from 'three';
import { observer } from 'mobx-react';
import { State } from './types';
import { Particle } from '../particle';


interface Props {
    position: Vector2;
    state: State;
    getColor: (state: State) => string;
}

export const Mode = observer((props: Props) => {
    const { position, state, getColor } = props;
    return (
        <Particle
            x={position ? position.x : 0}
            y={position ? position.y : 0}
            color={getColor(state)}
        />
    );
});

export function getColorByMouseMode(state: State): string {
    switch (state.mouseMode) {
        case 'idle': return 'blue';
        case 'drag': return 'orange';
    }
}

export function getColorByKeyMode(state: State): string {
    switch (state.keyMode) {
        case 'idle': return 'blue';
        case 'step': return 'orange';
    }
}
