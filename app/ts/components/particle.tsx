import * as React from 'react';
import { Vector2, Vector3 } from 'three';
import { Parametric } from './parametric';
import { WIDTH_SCALE } from '~/constants';


interface Props {
    x?: number;
    y?: number;
    color?: string;
    width?: number;
    height?: number;
}

export function Particle(props: Props) {
    const { x, y, color } = props;
    const width = (props.width || 1) * WIDTH_SCALE;
    const height = props.height ? props.height * WIDTH_SCALE : width;
    if (width <= 0 && height <= 0) {
        return null;
    }
    return (
        <Parametric
            position={new Vector2((x || 0) * WIDTH_SCALE, (y || 0) * WIDTH_SCALE)}
            slices={1}
            stacks={1}
            parametricFunction={(u, v) => pointInTheQuad(u, v, width, height)}
            color={color}
        />
    );
}

function pointInTheQuad(u: number, v: number, width: number, height: number): Vector3 {
    return new Vector3(
        u * width,
        v * height,
        0
    );
}
