import * as React from 'react';
import { Vector3, Texture, Mesh, BoxGeometry, MeshBasicMaterial, MeshLambertMaterial } from 'three';
import { getMaterialParams } from '~/utils';


interface Props {
    position: Vector3;
    width: number;
    height: number;
    depth: number;
    color?: string;
    texture?: Texture;
    receiveLight?: boolean;
    name?: string;
    onRef?: (m: Mesh | null) => void;
}

export function Cube(props: Props) {
    const {
        position, width, height, depth, color, texture, receiveLight, name, onRef
    } = props;
    const matParams = getMaterialParams(color, texture);
    return (
        <mesh
            position={position}
            name={name}
            ref={onRef}
        >
            <boxGeometry
                width={width}
                height={height}
                depth={depth}
                widthSegments={1}
                heightSegments={1}
                depthSegments={1}
            />
            {receiveLight ?
                <meshLambertMaterial {...matParams} /> :
                <meshBasicMaterial {...matParams} />
            }
        </mesh>
    );
}


export function CubeMesh(props: Props): Mesh {
    const { position, width, height, depth, color, receiveLight, texture } = props;
    const matParams = getMaterialParams(color, texture);
    const result = new Mesh(
        new BoxGeometry(width, height, depth),
        receiveLight ?
            new MeshLambertMaterial(matParams) :
            new MeshBasicMaterial(matParams)
    );
    result.position.x = position.x;
    result.position.y = position.y;
    result.position.z = position.z;
    result.updateMatrix();
    return result;
}
