import * as React from 'react';
import { observer } from 'mobx-react';
import { Store } from './store';
import { Euler, VertexColors, Vector3 } from 'three';
import { convertToColor } from '~/utils';


interface Props {
    angle: number;
}

export const Mesh = observer((props: Props) => {
    const { angle } = props;
    const { background } = Store.style;
    return (
        <mesh rotation={new Euler(0, 0, angle)}>
            <parametricGeometry
                parametricFunction={radialWave}
                slices={40}
                stacks={1}
            />
            <meshBasicMaterial
                wireframe={true}
                color={convertToColor(background)}
                vertexColors={VertexColors}
            />
        </mesh>
    );
});


function radialWave(u: number, v: number): Vector3 {
    const ang = 2 * u * Math.PI;
    return new Vector3(v * Math.cos(ang), v * Math.sin(ang), 0);
}
