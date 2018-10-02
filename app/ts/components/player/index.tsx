import * as React from 'react';
import { Vector2 } from 'three';
import { observer } from 'mobx-react';
import { Store as html } from '~/views/html/store';
import { Store as events } from '../events/store';
import { Store } from './store';
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
    if (events.state.stepMode) {
        Store.moveUp(false);
        Store.moveDown(false);
        Store.moveLeft(false);
        Store.moveRight(false);
    }
    html.setContent(null);
}

const PlayerComponent = observer((props: ColorProps) => {
    const position = new Vector2(Store.position.x, Store.position.y);
    return (
        <group>
            <Camera position={position} />
            <Thruster
                name={'player'}
                color={props.color}
                moving={Store.moving}
                position={position}
                onPositionChange={v => Store.setPosition(v.x, v.y)}
                onCollide={onCollide}
                onUnCollide={onUncollide}
                onEveryTick={update}
            />
        </group>
    );
});


export function Player(props: PositionProps & ColorProps) {
    return (
        <MountAndInit
            component={<PlayerComponent color={props.color} />}
            onMount={() => Store.init(props.position)}
        />
    );
}
