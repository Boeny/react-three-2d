import * as React from 'react';
import { WidthEllipseRing } from './ring';


interface Props extends PositionProps {
    radius: number;
}

export function Container(props: Props) {
    return (
        <WidthEllipseRing
            radius2={props.radius}
            width={0.1}
            {...props}
        />
    );
}
