import * as React from 'react';
import { Vector2 } from 'three';
import { Particle } from './particle';


interface Props {
    position: Vector2;
    color: string;
    width: number;
    height?: number;
    isMovable?: boolean;
    hasCollider?: boolean;
    children?: any;
}

export function Box(props: Props) {
    const { width, position, children, color } = props;
    const height = props.height || width;
    return (
        <group>
            <Particle
                color={color}
                x={position.x}
                y={position.y}
                width={width}
                height={height}
            />
            {children}
        </group>
    );
}
