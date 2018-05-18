import * as React from 'react';
import { Vector2 } from 'three';
import { observer } from 'mobx-react';
import { Store } from './store';
import { Store as html } from '~/views/html/store';
import { Position } from './types';
import { Body } from '../body';
import { Particle } from '../particle';
import { MountAndInit } from '../mount-and-init';
import { Camera } from '../camera';
// import { WIDTH_SCALE } from '~/constants';


function setPosition(v: Position) {
    Store.setPosition(v);
}

function setVelocity(v: Vector2) {
    Store.setVelocity(v);
}

export const PlayerComponent = observer(() => {
    const { moving, velocity } = Store;
    const position = new Vector2(Store.position.x, Store.position.y);
    return (
        <group>
            <Camera position={position} />
            <Body
                name={'player'}
                color={'#ffffff'}
                isMovable={true}
                position={position}
                velocity={new Vector2(velocity.x, velocity.y)}
                onPositionChange={setPosition}
                onVelocityChange={setVelocity}
                onCollide={collider => html.setContent(collider.name || '')}
                onUnCollide={() => html.setContent('')}
            />
            {moving.up ?
                <Particle
                    key={1}
                    position={{ x: position.x + 0.25, y: position.y + 0.75 }}
                    color={'#ff0000'}
                    zIndex={2}
                    width={0.5}
                    height={0.25}
                    borderWidth={0}
                />
            : null}
            {moving.down ?
                <Particle
                    key={2}
                    position={{ x: position.x + 0.25, y: position.y }}
                    color={'#00ff00'}
                    zIndex={2}
                    width={0.5}
                    height={0.25}
                    borderWidth={0}
                />
            : null}
            {moving.left ?
                <Particle
                    key={3}
                    position={{ x: position.x, y: position.y + 0.25 }}
                    color={'#0000ff'}
                    zIndex={2}
                    width={0.25}
                    height={0.5}
                    borderWidth={0}
                />
            : null}
            {moving.right ?
                <Particle
                    key={4}
                    position={{ x: position.x + 0.75, y: position.y + 0.25 }}
                    color={'#00ffff'}
                    zIndex={2}
                    width={0.25}
                    height={0.5}
                    borderWidth={0}
                />
            : null}
        </group>
    );
});


export function Player(props: PositionProps) {
    return (
        <MountAndInit
            component={<PlayerComponent />}
            onMount={() => Store.init(props.position)}
        />
    );
}
