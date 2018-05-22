import * as React from 'react';
import { Vector2 } from 'three';
import { observer } from 'mobx-react';
import { State } from './types';
import { boolColor } from '~/utils';
import { Body } from '../body';


interface Props {
    position: Vector2;
    field: keyof State;
    state: State;
}

export const Mode = observer((props: Props) => {
    const { position, state, field } = props;
    return (
        <Body
            name={`${field} = ${state[field]}`}
            position={position}
            color={boolColor(state[field])}
            hasCollider={true}
        />
    );
});
