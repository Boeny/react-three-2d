import * as React from 'react';
import { Mesh, MeshProps } from './mesh';


interface Props extends MeshProps {
    width: number;
    height: number;
    depth: number;
}

export function Cube(props: Props) {
    const { width, height, depth, ...rest } = props;
    return (
        <Mesh {...rest} >
            <boxGeometry
                width={width}
                height={height}
                depth={depth}
                widthSegments={1}
                heightSegments={1}
                depthSegments={1}
            />
        </Mesh>
    );
}
