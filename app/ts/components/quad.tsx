import * as React from 'react';
import { Mesh, MeshProps } from './mesh';


interface Props extends MeshProps {
    width: number;
    height: number;
}

export function Quad(props: Props) {
    const { width, height, ...rest } = props;
    return (
        <Mesh {...rest}>
            <planeGeometry
                width={width}
                height={height}
                widthSegments={1}
                heightSegments={1}
            />
        </Mesh>
    );
}
