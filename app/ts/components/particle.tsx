import * as React from 'react';
import { Vector3 } from 'three';
import { hasCollider } from './colliders/hasCollider';
import { Quad } from './parametric/quad';
import { WIDTH_SCALE, Z_INDEX_STEP } from '~/constants';


const BORDER_WIDTH = 0.1;

interface Props {
    position: { x: number, y: number };
    color: string;
    width?: number;
    height?: number;
    zIndex?: number;
    borderWidth?: number;
}

export function Particle(props: Props) {
    const { width, height } = props;
    const resultWidth =  width === undefined ? WIDTH_SCALE : width * WIDTH_SCALE;
    const resultHeight = height === undefined ? resultWidth : height * WIDTH_SCALE;
    if (resultWidth <= 0 || resultHeight <= 0) {
        return null;
    }
    const { position, zIndex, borderWidth, color } = props;
    const x = position.x * WIDTH_SCALE;
    const y = position.y * WIDTH_SCALE;
    const z = zIndex ? zIndex * Z_INDEX_STEP : 0;
    const border = borderWidth === undefined ? BORDER_WIDTH : borderWidth;
    return (
        <group>
            {border > 0 ?
                <Quad
                    position={new Vector3(x, y, z)}
                    width={resultWidth}
                    height={resultHeight}
                    color={'#000000'}
                />
            : null}
            <Quad
                position={new Vector3(x + border, y + border, z + Z_INDEX_STEP / 2)}
                width={resultWidth - border * 2}
                height={resultHeight - border * 2}
                color={color}
            />
        </group>
    );
}


export const ParticleCollider = hasCollider(Particle);
