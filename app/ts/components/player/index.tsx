import * as React from 'react';
import { Vector2 } from 'three';
import { observer } from 'mobx-react';
import { Store as html } from '~/views/html/store';
import { eventsStore } from '~/utils/events';
import { playerStore } from './store';
import { IStore as IBodyStore } from '../body/types';
import { MountAndInit } from '../mount-and-init';
import { Camera } from '../camera';
import { Thruster } from '../thruster';


const update = () => {
    /*if (events.state.switchMode) {
        events.setSwitchMode(false);
        if (currentCollider) {

        }
    }*/
};

// let currentCollider: IBodyStore | undefined;

function onCollide(collider: IBodyStore) {
    // currentCollider = collider;
    if (collider.isMovable) {
        return;
    }
    html.setContent(collider.state.name);
}

function onUncollide() {
    // currentCollider = undefined;
    if (eventsStore.stepMode) {
        playerStore.moveUp(false);
        playerStore.moveDown(false);
        playerStore.moveLeft(false);
        playerStore.moveRight(false);
    }
    html.setContent(null);
}

const PlayerComponent = observer(() => {
    const position = new Vector2(playerStore.position.x, playerStore.position.y);
    return (
        <group>
            <Camera position={position} />
            <Thruster
                name={'player'}
                moving={playerStore.moving}
                position={position}
                onPositionChange={v => playerStore.setPosition(v.x, v.y)}
                onCollide={onCollide}
                onUnCollide={onUncollide}
                onEveryTick={update}
            />
        </group>
    );
});


export function Player(props: PositionProps) {
    return (
        <MountAndInit
            component={<PlayerComponent />}
            onMount={() => playerStore.setPosition(props.position.x, props.position.y)}
        />
    );
}
