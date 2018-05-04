import * as React from 'react';
import { Vector2 } from 'three';
import { Stick } from './stick';


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
    const width2 = width / 2;
    const height2 = height ? height / 2 : width2;
    const pos = position || new Vector2();
    return (
        <group>
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
