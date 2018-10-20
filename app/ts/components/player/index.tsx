import * as React from 'react';
import { observer } from 'mobx-react';
import { Store as camera } from '../camera/store';
import { Store as movable } from '../movable/store';
import { Store } from './store';
import { MountAndInit } from '../mount-and-init';
import { Camera, Props as CameraProps } from '../camera';
import { MIN_SPEED } from '~/constants';


const PlayerComponent = observer((props: CameraProps) => {
    return (
        <Camera {...props} />
    );
});


export function Player(props: CameraProps) {
    return (
        <MountAndInit
            component={<PlayerComponent {...props} />}
            onMount={() => movable.add({ onEveryTick })}
        />
    );
}

function onEveryTick() {
    if (!Store.isMoving()) {
        return;
    }
    const { left, right, up, down } = Store.moving;
    const speed = MIN_SPEED * camera.state.zoom;
    camera.updatePositionBy({
        x: right ? speed : (left ? -speed : 0),
        y: up ? speed : (down ? -speed : 0),
        z: 0
    });
}
