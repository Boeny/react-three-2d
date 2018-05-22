import * as React from 'react';
import { Vector2 } from 'three';
import { observer } from 'mobx-react';
import { Store as html } from '~/views/html/store';
// import { Store as events } from '../events/store';
import { Store } from './store';
import { IBodyStore } from '../colliders/types';
import { Position, Moving } from './types';
import { Body } from '../body';
import { Particle } from '../particle';
import { MountAndInit } from '../mount-and-init';
import { Camera } from '../camera';
import { MAX_SPEED } from '~/constants';


function setPosition(v: Position) {
    Store.setPosition(v.x, v.y);
}

function setVelocity(v: number, coo: 'x' | 'y') {
    Store.setVelocity(v, coo);
}

const update = (moving: Moving) => () => {
    if (moving.left) {
        setVelocity(-MAX_SPEED, 'x');
    }
    if (moving.right) {
        setVelocity(MAX_SPEED, 'x');
    }
    if (moving.up) {
        setVelocity(MAX_SPEED, 'y');
    }
    if (moving.down) {
        setVelocity(-MAX_SPEED, 'y');
    }
};

const onCollide = (velocity: Vector2) => (collider: IBodyStore) => {
    collider.velocity = velocity;
    setContent(collider.name);
};

function setContent(v?: string | JSX.Element) {
    html.setContent(v || null);
}

export const PlayerComponent = observer(() => {
    const { moving } = Store;
    const position = new Vector2(Store.position.x, Store.position.y);
    const velocity = new Vector2(Store.velocity.x, Store.velocity.y);
    return (
        <group>
            <Camera position={position} />
            <Body
                name={'player'}
                color={'#ffffff'}
                isMovable={true}
                position={position}
                velocity={velocity}
                onPositionChange={setPosition}
                onCollide={onCollide(velocity)}
                onUnCollide={setContent}
                onEveryTick={update(moving)}
            />
            {moving.up ?
                <Particle
                    key={1}
                    position={new Vector2(0.25, 0.75).add(position)}
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
                    position={new Vector2(0.25, 0).add(position)}
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
                    position={new Vector2(0, 0.25).add(position)}
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
                    position={new Vector2(0.75, 0.25).add(position)}
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
