import * as React from 'react';
import { Vector3 } from 'three';
import { WidthRing } from '../ring';


interface Props {
    radius: number;
    position?: Vector3;
    children?: any;
}

export function FirstDeck(props: Props) {
    return (
        <scene>
            <WidthRing
                width={30}
                radius={props.radius}
                position={props.position}
                color={'#f48cfb'}
            />
            {props.children}
        </scene>
    );
}
