import * as React from 'react';
import { Vector2 } from 'three';
import { Particle } from './particle';


interface Props {
    position: Vector2;
    color: string;
    width: number;
    height?: number;
    children?: any;
}

export function Box(props: Props) {
    const { width, position, children, color } = props;
    const height = props.height === undefined ? width : props.height;
    return (
        <group>
            <Particle
                position={position}
                color={color}
                width={width}
                height={height}
            />
            {children}
        </group>
    );
}
