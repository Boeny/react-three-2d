import * as React from 'react';
import { Store } from './store';
import { Container } from '../container';


export function Movable(props: PositionProps) {
    return (
        <Container
            data={Store.bodies}
            position={props.position}
        />
    );
}
