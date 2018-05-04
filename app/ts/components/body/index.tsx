import * as React from 'react';
import { Vector2 } from 'three';
import { observer } from 'mobx-react';
import { getStore } from './store';
import { setStatic } from './utils';
import { IStore } from './types';
import { Particle } from '../particle';
import { Bodies } from './constants';


const Connected = observer((props: { store: IStore }) => {
    const { position } = props.store;
    return (
        <Particle
            x={position.x}
            y={position.y}
        />
    );
});


interface Props {
    name?: string;
    position?: Vector2;
    getInstance?: (body: IStore) => void;
}

export function Body(props: Props) {
    const { name, position, getInstance } = props;
    const store = getStore(position);
    if (name) {
        store.name = name;
    }
    if (name !== 'player') {
        setStatic(position || new Vector2(), store);
    }
    Bodies.push(store);
    getInstance && getInstance(store);
    return (
        <Connected store={store} />
    );
}
