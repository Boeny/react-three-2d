import * as React from 'react';
import { WidthRing } from '../ring';


const ROLLING_CIRCLE_WIDTH = 15;

interface Props extends PositionProps {
    radius: number;
    children?: any;
}

export function RollingCircle(props: Props) {
    return (
        <group position={props.position}>
            <WidthRing
                width={ROLLING_CIRCLE_WIDTH}
                radius={props.radius + ROLLING_CIRCLE_WIDTH}
            />
            {props.children}
        </group>
    );
}
