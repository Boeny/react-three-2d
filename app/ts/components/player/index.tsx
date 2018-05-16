import * as React from 'react';
import { Vector2 } from 'three';
import { observer } from 'mobx-react';
import { Store } from './store';
import { Body } from '../body';
import { Particle } from '../particle';
import { MountAndInit } from '~/components/mount-and-init';
// import { WIDTH_SCALE } from '~/constants';


export const PlayerComponent = observer(() => {
    const { moving, velocity, position } = Store;
    return (
        <group>
            <Body
                name={'player'}
                color={'#ffffff'}
                isMovable={true}
                velocity={new Vector2(velocity.x, velocity.y)}
                position={new Vector2(position.x, position.y)}
            />
            {moving.up ?
                <Particle
                    key={1}
                    x={position.x + 0.25}
                    y={position.y + 0.75}
                    color={'#ff0000'}
                    zIndex={2}
                    width={0.5}
                    height={0.25}
                />
            : null}
            {moving.down ?
                <Particle
                    key={2}
                    x={position.x + 0.25}
                    y={position.y + 0.25}
                    color={'#00ff00'}
                    zIndex={2}
                    width={0.5}
                    height={0.25}
                />
            : null}
            {moving.left ?
                <Particle
                    key={3}
                    x={position.x}
                    y={position.y + 0.25}
                    color={'#0000ff'}
                    zIndex={2}
                    width={0.25}
                    height={0.5}
                />
            : null}
            {moving.right ?
                <Particle
                    key={4}
                    x={position.x + 0.75}
                    y={position.y + 0.25}
                    color={'#00ffff'}
                    zIndex={2}
                    width={0.25}
                    height={0.5}
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
