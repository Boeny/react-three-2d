import * as React from 'react';
import { Vector2 } from 'three';
import { IStore as IBodyStore } from '../body/types';
import { Position, Moving } from './types';
import { Body } from '../body';
import { MAX_SPEED } from '~/constants';


const getUpdate = (moving: Partial<Moving>) => (store: IBodyStore) => {
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

function updateMoving(store: IBodyStore, moving: Partial<Moving>) {
    getUpdate(moving)(store);
}


interface Props extends PositionProps, ColorProps {
    name: string;
    moving?: Moving;
    onEveryTick?: (body: IBodyStore) => void;
    onPositionChange?: (v: Position) => void;
    onVelocityChange?: (v: Vector2) => void;
    onCollide?: (collider: IBodyStore) => void;
    onUnCollide?: () => void;
}

export function Thruster(props: Props) {
    const { moving, onEveryTick, position, color, ...rest } = props;
    const update = moving ? getUpdate(moving) : () => {};
    return (
        <Body
            {...rest}
            color={color}
            isMovable={true}
            position={position}
            onEveryTick={body => {
                update(body);
                onEveryTick && onEveryTick(body);
            }}
            onSignal={updateMoving}
        />
    );
}
