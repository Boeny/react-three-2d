import * as React from 'react';
import { Vector3 } from 'three';
import { Position } from '~/types';
import { Cube } from './cube';


interface Props {
    position: Position;
    rotation: number;
}

export function Tank(props: Props) {
    const { position, rotation } = props;
    return (
        <Cube
            position={new Vector3(position.x, position.y, 0)}
            rotation={{ x: 0, y: 0, z: rotation }}
            width={2}
            height={1}
            depth={0.5}
            receiveLight={true}
        />
    );
}
