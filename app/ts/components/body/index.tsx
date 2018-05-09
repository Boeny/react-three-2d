import * as React from 'react';
import { Vector2 } from 'three';
import { observer } from 'mobx-react';
import { getStore } from './store';
import { setCollider } from '../colliders/utils';
import { IStore } from './types';
import { Particle } from '../particle';
import { Store as movable } from '../movable/store';
import { TAILS_ENABLED } from '~/constants';


interface ConnectedProps {
    store: IStore;
}

const Connected = observer((props: ConnectedProps) => {
    const { position, color } = props.store;
    return (
        <Particle
            x={position.x}
            y={position.y}
            color={color}
        />
    );
});

const Tail = observer((props: ConnectedProps) => {
    const { store } = props;
    const { position, history } = store;
    const color = store.color === 'white' ? '255,255,255' :
        (store.color === 'yellow' ? '255,255,0' : '255,0,0');
    return (
        <group>
            <Particle
                x={position.x}
                y={position.y}
                color={`rgba(${color},1)`}
            />
            {history[0] ?
                <Particle
                    x={history[0].x}
                    y={history[0].y}
                    color={`rgba(${color},0)`}
                />
            : null}
        </group>
    );
});


interface Props {
    name?: string;
    color?: string;
    hasCollider?: boolean;
    isStatic?: boolean;
    position?: Vector2;
    tail?: boolean;
    getInstance?: (body: IStore) => void;
    afterUpdate?: (pos: Vector2) => void;
}

export function Body(props: Props) {
    const { name, color, hasCollider, isStatic, tail, getInstance, afterUpdate } = props;
    const position = props.position || new Vector2();
    const store = getStore(position, color || 'white', afterUpdate);
    if (name) {
        store.name = name;
    }
    if (tail) {
        store.tail = tail;
    }
    if (hasCollider) {
        setCollider(store);
    }
    if (!isStatic) {
        movable.add(store);
    }
    getInstance && getInstance(store);
    return (
        tail && TAILS_ENABLED ?
            <Tail store={store} />
            :
            <Connected store={store} />
    );
}
