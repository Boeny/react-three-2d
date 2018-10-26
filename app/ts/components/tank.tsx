import * as React from 'react';
import { Vector3 } from 'three';
import { Position } from '~/types';
import { Cube } from './cube';


interface Props {
    position: Position;
    rotation: number;
}

export function Tank(props: Props) {
    const { position } = props;
    return (
        <Cube
            position={new Vector3(position.x, position.y, 0)}
            width={1}
            height={1}
            depth={1}
            receiveLight={true}
        />
    );
}
