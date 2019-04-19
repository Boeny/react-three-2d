import * as React from 'react';
import { Vector3, Texture, Mesh as MeshType, Euler } from 'three';
import { getMaterialParams } from '~/utils';
import { Position3 } from '~/types';


export interface MeshProps {
    position: Vector3;
    color?: string;
    texture?: Texture;
    receiveLight?: boolean;
    name?: string;
    rotation?: Position3;
    onRef?: (m: MeshType | null) => void;
}

interface Props extends MeshProps {
    children: any;
}

export function Mesh(props: Props) {
    const {
        position, color, texture, receiveLight, name, onRef, rotation, children
    } = props;
    const matParams = getMaterialParams(color, texture);
    return (
        <mesh
            position={position}
            rotation={rotation ? new Euler(rotation.x, rotation.y, rotation.z) : undefined}
            name={name}
            ref={onRef}
        >
            {children}
            {receiveLight !== false ?
                <meshLambertMaterial {...matParams} /> :
                <meshBasicMaterial {...matParams} />
            }
        </mesh>
    );
}
