import * as React from 'react';
import { Color, VertexColors, Vector3 } from 'three';
import { SHOW_AS_WIREFRAME } from '~/constants';


interface Props extends PositionProps {
    parametricFunction: (u: number, v: number) => Vector3;
    slices: number;
    stacks: number;
    color?: string;
}

export function Parametric(props: Props) {
    const { color, position, slices, stacks, parametricFunction } = props;
    return (
        <mesh position={position ? new Vector3(position.x, position.y, 0) : undefined}>
            <parametricGeometry
                parametricFunction={parametricFunction}
                slices={slices}
                stacks={stacks}
            />
            <meshBasicMaterial
                wireframe={SHOW_AS_WIREFRAME}
                color={new Color(color || 'white')}
                vertexColors={VertexColors}
            />
        </mesh>
    );
}
