import * as React from 'react';
import { Store } from './store';
import { Container } from '../container';


export function Movable(props: PositionProps) {
    if (!Store.bodies.every(body => Store.isBody(body))) {
        return null;
    }
    return (
        <Container
            data={Store.bodies as any}
            position={props.position}
        />
    );
}
