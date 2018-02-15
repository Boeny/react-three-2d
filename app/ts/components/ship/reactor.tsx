import * as React from 'react';
import { Vector3 } from 'three';
import { WidthRing } from '../ring';


interface Props {
    radius: number;
    position?: Vector3;
    children?: any;
}

export function Reactor(props: Props) {
    return (
        <scene>
            <WidthRing
                width={2}
                radius={props.radius}
                position={props.position}
                color={'red'}
            />
            {props.children}
        </scene>
    );
}
