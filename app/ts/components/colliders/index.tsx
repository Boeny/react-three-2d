import * as React from 'react';
import { Store } from './store';
import { Container } from '../container';


export function Colliders(props: PositionProps) {
    return (
        <Container
            data={Store.colliders}
            position={props.position}
        />
    );
}
