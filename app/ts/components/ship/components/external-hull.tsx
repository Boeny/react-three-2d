import * as React from 'react';
import { WidthRing } from '~/components';


interface Props extends PositionProps {
    radius: number;
    children?: any;
}

export function ExternalHull(props: Props) {
    return (
        <group position={props.position}>
            <WidthRing
                width={10}
                radius={props.radius}
            />
            {props.children}
        </group>
    );
}
