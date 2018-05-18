import * as React from 'react';
import { Vector3 } from 'three';
import { Parametric } from './index';


interface Props {
    position: Vector3;
    width: number;
    height: number;
    color: string;
}

export function Quad(props: Props) {
    const { position, width, height, color } = props;
    return (
        <Parametric
            position={position}
            slices={1}
            stacks={1}
            parametricFunction={pointInTheQuad(width, height)}
            color={color}
        />
    );
}

const pointInTheQuad = (width: number, height: number) => (u: number, v: number): Vector3 => {
    return new Vector3(
        u * width,
        v * height,
        0
    );
};
