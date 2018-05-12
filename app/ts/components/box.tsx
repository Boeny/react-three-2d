import * as React from 'react';
import { Vector2, Vector3 } from 'three';
import { Parametric } from './parametric';
import { WIDTH_SCALE, Z_INDEX_STEP } from '~/constants';


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
            <Border
                x={position.x * WIDTH_SCALE}
                y={position.y * WIDTH_SCALE}
                z={0}
                color={color}
                width={width}
                height={height}
            />
            {children}
        </group>
    );
}


interface BorderProps {
    x: number;
    y: number;
    z: number;
    width: number;
    height: number;
    color: string;
}

function Border(props: BorderProps) {
    return (
        <Parametric
            position={new Vector2(props.x, props.y)}
            slices={1}
            stacks={1}
            parametricFunction={(u, v) => pointInTheQuad(u, v, props.width, props.height, props.z)}
            color={props.color}
        />
    );
}

function pointInTheQuad(u: number, v: number, width: number, height: number, z: number): Vector3 {
    return new Vector3(
        u * width,
        v * height,
        z
    );
}
