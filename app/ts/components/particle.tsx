import * as React from 'react';
import { Vector3 } from 'three';
import { hasCollider, Props as ColliderProps } from './colliders/hasCollider';
import { Quad } from './quad';
import { WIDTH_SCALE, Z_INDEX_STEP } from '~/constants';


const BORDER_WIDTH = 0.1;

interface Props {
    position: Position;
    color: string;
    borderColor?: string;// #000 by default
    width?: number;
    height?: number;
    zIndex?: number;
    borderWidth?: number; // BORDER_WIDTH by default
    borderOnly?: boolean;
}

export function Particle(props: Props) {
    const { width, height } = props;
    const resultWidth =  width === undefined ? WIDTH_SCALE : width * WIDTH_SCALE;
    const resultHeight = height === undefined ? resultWidth : height * WIDTH_SCALE;
    if (resultWidth <= 0 || resultHeight <= 0) {
        return null;
    }
    const { position, zIndex, borderWidth, color, borderColor, borderOnly } = props;
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
                    color={borderColor || '#000000'}
                />
            : null}
            {!borderOnly ?
                <Quad
                    position={new Vector3(x + border, y + border, z + Z_INDEX_STEP / 2)}
                    width={resultWidth - border * 2}
                    height={resultHeight - border * 2}
                    color={color}
                />
            : null}
        </group>
    );
}


export const ParticleCollider = hasCollider<Props & ColliderProps>(Particle);
