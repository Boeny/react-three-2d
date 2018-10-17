import * as React from 'react';
import { Vector3, Color, VertexColors, Texture } from 'three';
import { SHOW_AS_WIREFRAME } from '~/constants';


interface Props {
    position: Vector3;
    width: number;
    height: number;
    depth: number;
    color?: string;
    texture?: Texture;
    transparent?: boolean;
}

export function Cube(props: Props) {
    const { position, width, height, depth, color, texture, transparent } = props;
    return (
        <mesh position={position}>
            <boxGeometry
                width={width}
                height={height}
                depth={depth}
                widthSegments={1}
                heightSegments={1}
                depthSegments={1}
            />
            <meshBasicMaterial
                wireframe={SHOW_AS_WIREFRAME}
                color={new Color(color) || '#000000'}
                vertexColors={VertexColors}
                map={texture}
                transparent={transparent}
            />
        </mesh>
    );
}
