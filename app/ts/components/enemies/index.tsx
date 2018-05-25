import * as React from 'react';
import { observer } from 'mobx-react';
import { Vector2 } from 'three';
import { getNumArray } from '~/utils';
import { Thruster } from '../thruster';
import { Generator } from './generator';
import { MAX_SPEED } from '~/constants';


export function Enemies() {
    return (
        <group>
            {getNumArray(1).map(i => (
                <Enemy key={i} position={new Vector2(20, 15)} />
            ))}
        </group>
    );
}


function Enemy(props: PositionProps) {
    return (
        <group>
            {getNumArray(4).map(i => (
                <Mover
                    key={i}
                    offset={OFFSET[i]}
                    position={OFFSET[i].clone().multiplyScalar(-4).add(props.position)}
                />
            ))}
        </group>
    );
}

const OFFSET = [
    new Vector2(MAX_SPEED, 0),
    new Vector2(-MAX_SPEED, 0),
    new Vector2(0, MAX_SPEED),
    new Vector2(0, -MAX_SPEED)
];


interface MoveProps {
    offset: Vector2;
    position: Vector2;
}

const Mover = observer((props: MoveProps) => {
    const { offset, position } = props;
    return (
        <group>
            <Thruster
                name={'thruster'}
                position={position}
            />
            <Generator
                period={20}
                tickLength={10}
                position={position.clone().add(offset)}
            />
        </group>
    );
});
