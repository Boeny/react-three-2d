import * as React from 'react';
import { Vector2 } from 'three';
import { Stick } from './stick';
import { Particle } from './particle';


interface Props {
    width: number;
    height?: number;
    position?: Vector2;
    color?: string;
    isStatic?: boolean;
    hasCollider?: boolean;
    children?: any;
}

export function Box(props: Props) {
    const { width, position, children, ...rest } = props;
    const pos = position || new Vector2();
    const height = props.height || width;
    return (
        <group>
            <Particle
                x={pos.x}
                y={pos.y}
                width={width}
                height={height}
            />
            <Stick
                {...rest}
                length={width}
                getPosition={i => (new Vector2(i, 0)).add(pos)}
            />
            <Stick
                {...rest}
                length={width}
                getPosition={i => (new Vector2(i, height)).add(pos)}
            />
            <Stick
                {...rest}
                length={height}
                getPosition={i => (new Vector2(0, i)).add(pos)}
            />
            <Stick
                {...rest}
                length={height}
                getPosition={i => (new Vector2(width, i)).add(pos)}
            />
            {children}
        </group>
    );
}
