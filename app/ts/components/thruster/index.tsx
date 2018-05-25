import * as React from 'react';
import { Vector2 } from 'three';
import { observer } from 'mobx-react';
import { Store } from './store';
import { IStore as IBodyStore } from '../body/types';
import { Moving, Position } from './types';
import { Body } from '../body';
import { Directions } from './directions';
import { MountAndInit } from '../mount-and-init';
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


interface Props {
    name: string;
    moving?: Moving;
    onEveryTick?: (body: IBodyStore) => void;
    onPositionChange?: (v: Position) => void;
    onVelocityChange?: (v: Vector2) => void;
    onCollide?: (collider: IBodyStore) => void;
    onUnCollide?: () => void;
}

const ThrusterComponent = observer((props: Props) => {
    const { moving, onPositionChange, onEveryTick, ...rest } = props;
    const position = new Vector2(Store.position.x, Store.position.y);
    const update = moving ? getUpdate(moving) : () => {};
    return (
        <group>
            <Body
                {...rest}
                color={'#ff0000'}
                hasCollider={true}
                isMovable={true}
                position={position}
                onPositionChange={v => {
                    Store.setPosition(v.x, v.y);
                    onPositionChange && onPositionChange(v);
                }}
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
});


export function Thruster(props: Props & PositionProps) {
    return (
        <MountAndInit
            component={<ThrusterComponent {...props} />}
            onMount={() => Store.init(props.position)}
        />
    );
}
