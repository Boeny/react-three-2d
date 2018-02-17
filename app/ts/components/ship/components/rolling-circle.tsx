import * as React from 'react';
import { WidthRing } from '~/components';
import { ROLLING_CIRCLE_WIDTH } from '../constants';


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
