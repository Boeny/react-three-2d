import * as React from 'react';
import { observer } from 'mobx-react';
import { Store as html } from '~/views/html/store';
import { Store as movable } from '../movable/store';
import { Store as camera } from '../camera/store';
import { Store as player } from './store';
import { Position } from '~/types';
import { Moving } from './types';
import { MountAndInit } from '../mount-and-init';
import { Tank } from '../tank';
import { MAX_SPEED } from '../../constants';


const BORDER_PERCENT = 0.5;

const Component = observer(() => {
    return (
        <Tank
            position={player.state.position}
            rotation={0}
        />
    );
});


export function MovableTank() {
    return (
        <MountAndInit
            component={<Component />}
            onMount={() => movable.add({ onEveryTick })}
        />
    );
}

function onEveryTick() {
    if (player.isMoving() === false) {
        return;
    }
    const position = getPosition(player.moving);
    player.updatePositionBy(position, onPlayerPositionUpdate);
}

function getPosition({ left, right, up, down }: Moving) {
    const speed = MAX_SPEED;
    return {
        x: right ? speed : (left ? -speed : 0),
        y: up ? speed : (down ? -speed : 0)
    };
}

function onPlayerPositionUpdate(p: Position) {
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
