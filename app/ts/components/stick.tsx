import * as React from 'react';
import { Vector2 } from 'three';
import { getNumArray } from '~/utils';
import { Body } from './body';


interface Props {
    length: number;
    getPosition: (i: number) => Vector2;
    color?: string;
    isStatic?: boolean;
    hasCollider?: boolean;
}

export function Stick(props: Props) {
    const { length, getPosition, color, isStatic, hasCollider } = props;
    return (
        <group>
            {getNumArray(length).map(i => (
                <Body
                    key={i}
                    isStatic={isStatic}
                    hasCollider={hasCollider}
                    position={getPosition(i)}
                    color={color}
                />
            ))}
        </group>
    );
}
