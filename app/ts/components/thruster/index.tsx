import * as React from 'react';
import { Vector2 } from 'three';
import { IStore as IBodyStore } from '../body/types';
import { Position, Moving } from './types';
import { Body } from '../body';
import { Directions } from './directions';
import { MAX_SPEED } from '~/constants';


const getUpdate = (moving: Moving) => (store: IBodyStore) => {
    if (moving.left || moving.right) {
        store.setVelocity((moving.right ? 1 : -1) * MAX_SPEED, 'x');
    } else {
        store.setVelocity(0, 'x');
    }
    if (moving.up || moving.down) {
        store.setVelocity((moving.up ? 1 : -1) * MAX_SPEED, 'y');
    } else {
        store.setVelocity(0, 'y');
    }
};


interface Props extends PositionProps {
    name: string;
    moving?: Moving;
    onEveryTick?: (body: IBodyStore) => void;
    onPositionChange?: (v: Position) => void;
    onVelocityChange?: (v: Vector2) => void;
    onCollide?: (collider: IBodyStore) => void;
    onUnCollide?: () => void;
}

export function Thruster(props: Props) {
    const { moving, onEveryTick, position, ...rest } = props;
    const update = moving ? getUpdate(moving) : () => {};
    return (
        <group>
            <Body
                {...rest}
                color={'#ff0000'}
                hasCollider={true}
                isMovable={true}
                position={position}
                onEveryTick={body => {
                    update(body);
                    onEveryTick && onEveryTick(body);
                }}
            />
            {moving ?
                <Directions
                    moving={moving}
                    position={position}
                />
            : null}
        </group>
    );
}
