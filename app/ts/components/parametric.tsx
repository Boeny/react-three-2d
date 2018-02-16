import * as React from 'react';
import { Euler, Color, VertexColors, Vector3 } from 'three';


interface Props extends PositionProps {
    parametricFunction: (u: number, v: number) => Vector3;
    slices: number;
    stacks: number;
    color?: string;
}

export function Parametric(props: Props) {
    const { angle, color, position, slices, stacks, parametricFunction } = props;
    return (
        <mesh rotation={new Euler(0, 0, angle || 0)} position={position}>
            <parametricGeometry
                parametricFunction={parametricFunction}
                slices={slices}
                stacks={stacks}
            />
            <meshBasicMaterial
                wireframe={true}
                color={new Color(color || 'white')}
                vertexColors={VertexColors}
            />
        </mesh>
    );
}
