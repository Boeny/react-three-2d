import * as React from 'react';
import { Vector2 } from 'three';
// import { Stick } from './stick';
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
    rest;
    const pos = position || new Vector2();
    const height = props.height || width;
    return (
        <group>
            <Particle
                x={pos.x + 1}
                y={pos.y + 1}
                width={width - 2}
                height={height - 2}
            />
            {children}
        </group>
    );
}

/*
<Stick
                {...rest}
                length={width}
                getPosition={i => (new Vector2(i, 0)).add(pos)}
            />
            <Stick
                {...rest}
                length={width}
                getPosition={i => (new Vector2(i, height - 1)).add(pos)}
            />
            <Stick
                {...rest}
                length={height - 2}
                getPosition={i => (new Vector2(0, i + 1)).add(pos)}
            />
            <Stick
                {...rest}
                length={height - 2}
                getPosition={i => (new Vector2(width - 1, i + 1)).add(pos)}
            />
*/
