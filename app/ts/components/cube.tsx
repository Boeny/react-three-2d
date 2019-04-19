import * as React from 'react';
import { Mesh, MeshProps } from './mesh';


const WIDTH = 1;

interface Props extends MeshProps {
    width?: number;
    height?: number;
    depth?: number;
}

export function Cube(props: Props) {
    const { width, height, depth, ...rest } = props;
    return (
        <Mesh {...rest} >
            <boxGeometry
                width={width || WIDTH}
                height={height || WIDTH}
                depth={depth || WIDTH}
                widthSegments={1}
                heightSegments={1}
                depthSegments={1}
            />
        </Mesh>
    );
}
