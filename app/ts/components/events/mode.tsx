import * as React from 'react';
import { Vector2 } from 'three';
import { observer } from 'mobx-react';
import { State } from './types';
import { boolColor } from '~/utils';
import { Particle } from '../particle';


interface Props {
    position: Vector2;
    field: keyof State;
    state: State;
    title?: string;
}

export const Mode = observer((props: Props) => {
    const { position, state, field } = props;
    return (
        <Particle
            hasCollider={true}
            name={`${field} = ${state[field]}`}
            x={position ? position.x : 0}
            y={position ? position.y : 0}
            color={boolColor(state[field])}
        />
    );
});
