import * as React from 'react';
import { Vector2 } from 'three';
import { observer } from 'mobx-react';
import { getStore } from './store';
import { setCollider } from './utils';
import { IStore } from './types';
import { Particle } from '../particle';
import { Store as Movable } from '../movable/store';


interface ConnectedProps {
    store: IStore;
    color?: string;
}

const Connected = observer((props: ConnectedProps) => {
    const { store, color } = props;
    return (
        <Particle
            x={store.position.x}
            y={store.position.y}
            color={color}
        />
    );
});


interface Props {
    name?: string;
    hasCollider?: boolean;
    isStatic?: boolean;
    position?: Vector2;
    color?: string;
    getInstance?: (body: IStore) => void;
    afterUpdate?: (pos: Vector2) => void;
}

export function Body(props: Props) {
    const { name, getInstance, color, hasCollider, isStatic, afterUpdate } = props;
    const position = props.position || new Vector2();
    const store = getStore(position, afterUpdate);
    if (name) {
        store.name = name;
    }
    if (hasCollider) {
        setCollider(position, store);
    }
    if (!isStatic) {
        Movable.push(store);
    }
    getInstance && getInstance(store);
    return (
        <Connected
            store={store}
            color={color}
        />
    );
}
