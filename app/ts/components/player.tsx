import * as React from 'react';
import { Vector3 } from 'three';
import { Body } from './body';
import { GRAVITY_FORCE } from '~/constants';


export function Player() {
    return (
        <Body
            mass={1}
            position={new Vector3(0, 1, 0)}
            force={GRAVITY_FORCE}
        />
    );
}
