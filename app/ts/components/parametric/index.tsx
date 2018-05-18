import * as React from 'react';
import { Color, VertexColors, Vector3 } from 'three';
import { SHOW_AS_WIREFRAME } from '~/constants';


interface Props {
    position: Vector3;
    color: string;
    slices: number;
    stacks: number;
    parametricFunction: (u: number, v: number) => Vector3;
}

export function Parametric(props: Props) {
    const { color, position, slices, stacks, parametricFunction } = props;
    return (
        <mesh position={position}>
            <parametricGeometry
                parametricFunction={parametricFunction}
                slices={slices}
                stacks={stacks}
            />
            <meshBasicMaterial
                wireframe={SHOW_AS_WIREFRAME}
                color={new Color(color)}
                vertexColors={VertexColors}
            />
        </mesh>
    );
}
