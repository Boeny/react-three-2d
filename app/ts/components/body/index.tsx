import * as React from 'react';
import { Vector2 } from 'three';
import { observer } from 'mobx-react';
import { getStore } from './store';
import { setCollider } from '../colliders/utils';
import { IStore } from './types';
import { Particle } from '../particle';
import { Store as movable } from '../movable/store';


interface ConnectedProps {
    store: IStore;
}

const Connected = observer((props: ConnectedProps) => {
    const { position, color } = props.store;
    return (
        <Particle
            zIndex={1}
            x={position.x}
            y={position.y}
            color={color}
        />
    );
});


interface Props {
    name?: string;
    color?: string;
    hasCollider?: boolean;
    isStatic?: boolean;
    position?: Vector2;
    getInstance?: (body: IStore) => void;
    afterUpdate?: (pos: Vector2) => void;
}

export function Body(props: Props) {
    const { name, color, hasCollider, isStatic, getInstance, afterUpdate } = props;
    const position = props.position || new Vector2();
    const store = getStore(position, color || 'white', afterUpdate);
    if (name) {
        store.name = name;
    }
    if (hasCollider) {
        setCollider(store);
    }
    if (!isStatic) {
        movable.add(store);
    }
    getInstance && getInstance(store);
    return (
        <Connected store={store} />
    );
}
