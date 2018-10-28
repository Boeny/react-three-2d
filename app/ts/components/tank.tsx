import * as React from 'react';
import { Vector3, Euler } from 'three';
import { Position } from '~/types';
import { Cube } from './cube';


interface Props {
    position: Position;
    rotation: number;
}

export function Tank(props: Props) {
    const { position, rotation } = props;
    return (
        <group>
            <Cube
                position={new Vector3(position.x, position.y, 0)}
                rotation={{ x: 0, y: 0, z: rotation }}
                width={3}
                height={2}
                depth={0.5}
                color={'#dddddd'}
            />
            <Tower position={position} rotation={rotation} />
        </group>
    );
}


function Tower(props: Props) {
    const { position, rotation } = props;
    return (
        <group
            position={new Vector3(position.x, position.y, 0.5)}
            rotation={new Euler(0, 0, rotation)}
        >
            <Cube
                position={new Vector3()}
                rotation={{ x: 0, y: 0, z: 0 }}
                width={1}
                height={1}
                depth={0.5}
                color={'#cccccc'}
            />
            <Cube
                position={new Vector3(1, 0, 0.0625)}
                rotation={{ x: 0, y: 0, z: 0 }}
                width={2}
                height={0.25}
                depth={0.25}
                color={'#aaaaaa'}
            />
        </group>
    );
}
