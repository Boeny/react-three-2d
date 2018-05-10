import * as React from 'react';
import { Store } from './store';
import { Body } from '../body';


export function Player(props: PositionProps) {
    return (
        <Body
            name={'player'}
            getInstance={body => Store.instance = body}
            position={props.position}
        />
    );
}
