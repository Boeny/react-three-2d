import * as React from 'react';
import * as constants from '~/constants';
import { Container } from './container';


export function Constants(props: PositionProps) {
    return (
        <Container
            borderColor={'grey'}
            data={Object.keys(constants).map(name => ({
                name,
                color: 'grey'
            }))}
            position={props.position}
        />
    );
}
