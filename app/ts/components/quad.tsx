import * as React from 'react';
import { Vector3, Color, VertexColors, Texture } from 'three';
import { SHOW_AS_WIREFRAME } from '~/constants';


interface Props {
    position: Vector3;
    width: number;
    height: number;
    color?: string;
    texture?: Texture;
    transparent?: boolean;
}

export function Quad(props: Props) {
    const { position, width, height, color, texture, transparent } = props;
    return (
        <mesh position={position}>
            <planeGeometry
                width={width}
                height={height}
                widthSegments={1}
                heigthSegments={1}
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
