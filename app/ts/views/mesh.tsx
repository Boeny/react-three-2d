import * as React from 'react';
import { observer } from 'mobx-react';
import { Euler, FlatShading, VertexColors, Vector3 } from 'three';
// import { getColor } from './test/actions';


interface Props {
    rotation: Euler;
}

export const Mesh = observer((props: Props) => {
    console.log('render');
    return (
        <mesh rotation={props.rotation}>
            <parametricGeometry
                parametricFunction={radialWave}
                slices={120}
                stacks={120}
            />
            <meshPhongMaterial
                color={0x00ff00}
                specular={0x999999}
                shading={FlatShading}
                vertexColors={VertexColors}
                castShadow={true}
                receiveShadow={true}
            />
        </mesh>
    );
});


function radialWave(u: number, v: number): Vector3 {
    const r = 1;
    const x = Math.sin(u) * r;
    const z = Math.sin(v) * 2 * r;
    return new Vector3(x, z, 0);
}
