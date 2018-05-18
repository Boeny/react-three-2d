import * as React from 'react';
import { Vector2 } from 'three';
import { observer } from 'mobx-react';
import { State } from './types';
import { boolColor } from '~/utils';
import { ParticleCollider } from '../particle';


interface Props {
    position: Vector2;
    field: keyof State;
    state: State;
}

export const Mode = observer((props: Props) => {
    const { position, state, field } = props;
    return (
        <ParticleCollider
            zIndex={1}
            position={position}
            color={boolColor(state[field])}
        />
    );
});
// name={`${field} = ${state[field]}`}
