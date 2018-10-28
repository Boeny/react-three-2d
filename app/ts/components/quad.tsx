import * as React from 'react';
import { Vector3, Texture, Euler } from 'three';
import { getMaterialParams } from '~/utils';
import { Position3 } from '~/types';


interface Props {
    position: Vector3;
    width: number;
    height: number;
    color?: string;
    texture?: Texture;
    receiveLight?: boolean;
    name?: string;
    rotation?: Position3;
}

export function Quad(props: Props) {
    const { position, width, height, color, texture, receiveLight, rotation, name } = props;
    const matParams = getMaterialParams(color, texture);
    return (
        <mesh
            position={position}
            rotation={rotation ? new Euler(rotation.x, rotation.y, rotation.z) : undefined}
            name={name}
        >
            <planeGeometry
                width={width}
                height={height}
                widthSegments={1}
                heightSegments={1}
            />
            {receiveLight !== false ?
                <meshLambertMaterial {...matParams} /> :
                <meshBasicMaterial {...matParams} />
            }
        </mesh>
    );
}
