import * as React from 'react';
import { Camera, Props as CameraProps } from '../camera';
import { MovableTank } from '../movable-tank';


export function Player(props: CameraProps) {
    return (
        <group>
            <Camera {...props} />
            <MovableTank />
        </group>
    );
}
