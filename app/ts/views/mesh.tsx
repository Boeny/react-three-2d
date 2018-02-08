import * as React from 'react';
import { observer } from 'mobx-react';
import { Euler, VertexColors, Vector3 } from 'three';
// import { getColor } from './test/actions';


interface Props {
    rotation: number;
}

export const Mesh = observer((props: Props) => {
    return (
        <mesh rotation={new Euler(0, 0, props.rotation)}>
            <parametricGeometry
                parametricFunction={radialWave}
                slices={120}
                stacks={120}
            />
            <meshBasicMaterial
                color={0x00ff00}
                vertexColors={VertexColors}
            />
        </mesh>
    );
});


function radialWave(u: number, v: number): Vector3 {
    const ang = u * 2 * Math.PI;
    return new Vector3(v * Math.cos(ang), v * Math.sin(ang), 0);
}
