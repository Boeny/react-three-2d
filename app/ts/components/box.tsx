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
    const { width, height, position, children, ...rest } = props;
    const width2 = Math.floor(width / 2);
    const height2 = height ? Math.floor(height / 2) : width2;
    const pos = position || new Vector2();
    return (
        <group>
            <Particle
                x={pos.x - width2}
                y={pos.y - height2}
                width={width}
                height={height || width}
            />
            <Stick
                {...rest}
                length={height || width}
                getPosition={i => (new Vector2(width2, i - height2)).add(pos)}
            />
            <Stick
                {...rest}
                length={height || width}
                getPosition={i => (new Vector2(-width2, i - height2)).add(pos)}
            />
            <Stick
                {...rest}
                length={width}
                getPosition={i => (new Vector2(i - width2, height2)).add(pos)}
            />
            <Stick
                {...rest}
                length={width}
                getPosition={i => (new Vector2(i - width2, -height2)).add(pos)}
            />
            {children}
        </group>
    );
}
