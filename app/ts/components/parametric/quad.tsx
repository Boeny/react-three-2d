import * as React from 'react';
import { Vector3, Color, VertexColors, Texture } from 'three';
import { SHOW_AS_WIREFRAME } from '~/constants';


interface Props {
    position: Vector3;
    width: number;
    height: number;
    color: string;
    texture?: Texture;
}

export function Quad(props: Props) {
    const { position, width, height, color, texture } = props;
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
                color={new Color(color)}
                vertexColors={VertexColors}
                map={texture}
                transparent={true}
            />
        </mesh>
    );
}
