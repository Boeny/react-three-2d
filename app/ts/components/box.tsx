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
    const height = props.height || width;
    return (
        <group>
            <Particle
                zIndex={-1}
                color={color}
                x={position.x}
                y={position.y}
                width={width}
                height={height}
            />
            <Particle
                color={color}
                x={position.x + 1}
                y={position.y + 1}
                width={width - 2}
                height={height - 2}
            />
            {children}
        </group>
    );
}
