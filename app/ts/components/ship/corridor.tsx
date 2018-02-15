import * as React from 'react';
import { Vector3 } from 'three';
import { WidthEllipseRing, pointInTheEllipse } from '../ring';


interface Props {
    start: number;
    end: number;
    angle?: number;
    position?: Vector3;
}

export function Corridor(props: Props) {
    const { start, end } = props;
    if (start > end) {
        console.warn('start position of the corridor must be less than the end position!');
        return null;
    }
    const radius = (end - start) / 2;
    const parentRadius = start + radius;
    const position = props.position || new Vector3();
    const angle = props.angle || 0;
    return (
        <WidthEllipseRing
            angle={angle}
            width={2}
            radius={radius}
            radius2={7}
            position={position.add(pointInTheEllipse(parentRadius, parentRadius, angle))}
        />
    );
}
