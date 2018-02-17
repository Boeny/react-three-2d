import * as React from 'react';
import { WidthRing } from '~/components';


interface Props extends PositionProps {
    radius: number;
}

export function Reactor(props: Props) {
    return (
        <WidthRing
            width={2}
            radius={props.radius}
            position={props.position}
            color={'red'}
        />
    );
}
