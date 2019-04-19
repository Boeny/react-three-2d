import * as React from 'react';
import { Mesh, MeshProps } from './mesh';


interface Props extends MeshProps {
    radius: number;
    widthSegments?: number;
    heightSegments?: number;
}

export function Sphere(props: Props) {
    const { radius, widthSegments, heightSegments, ...rest } = props;
    return (
        <Mesh {...rest}>
            <sphereGeometry
                radius={radius}
                widthSegments={widthSegments || 10}
                heightSegments={heightSegments || 10}
            />
        </Mesh>
    );
}
