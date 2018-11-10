import * as React from 'react';
import { Store as html } from '~/views/html/store';
import { Store as camera } from '../camera/store';
import { Store } from '../player/store';
import { Position } from '~/types';
import { Camera, Props as CameraProps } from '../camera';
import { MovableCreature } from '../movable-creature';


const BORDER_PERCENT = 0.5;


export function Player(props: CameraProps) {
    return (
        <group>
            <Camera {...props} />
            <MovableCreature
                name={'player'}
                store={Store}
                onPositionUpdate={onPositionUpdate}
            />
        </group>
    );
}

function onPositionUpdate(p: Position) {
    const { position } = camera.state;
    const { windowWidth, windowHeight } = html.state;
    const xBorder = camera.state.zoom * BORDER_PERCENT;
    const yBorder = xBorder * windowHeight / windowWidth;
    const dx = p.x - position.x;
    const dy = p.y - position.y;
    const diff = {
        x: Math.abs(dx) > xBorder ? (dx > 0 ? dx - xBorder : dx + xBorder) : 0,
        y: Math.abs(dy) > yBorder ? (dy > 0 ? dy - yBorder : dy + yBorder) : 0
    };
    if (diff.x === 0 && diff.y === 0) {
        return;
    }
    camera.updatePositionBy({
        x: diff.x,
        y: diff.y,
        z: 0
    });
}
