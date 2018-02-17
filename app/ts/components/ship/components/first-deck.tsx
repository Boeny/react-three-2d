import * as React from 'react';
import { WidthRing } from '~/components';


interface Props extends PositionProps {
    radius: number;
    children?: any;
}

export function FirstDeck(props: Props) {
    return (
        <group position={props.position}>
            <WidthRing
                width={30}
                radius={props.radius}
                color={'#f48cfb'}
            />
            {props.children}
        </group>
    );
}
