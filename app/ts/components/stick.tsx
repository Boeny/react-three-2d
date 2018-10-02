import * as React from 'react';
import { Vector2 } from 'three';
import { createArray } from '~/utils';
import { Body } from './body';


interface Props {
    length: number;
    getPosition: (i: number) => Vector2;
    color: string;
    isMovable?: boolean;
    hasCollider?: boolean;
}

export function Stick(props: Props) {
    const { length, getPosition, color, isMovable, hasCollider } = props;
    return (
        <group>
            {createArray(length).map(i => (
                <Body
                    key={i}
                    isMovable={isMovable}
                    hasCollider={hasCollider}
                    position={getPosition(i)}
                    color={color}
                />
            ))}
        </group>
    );
}
