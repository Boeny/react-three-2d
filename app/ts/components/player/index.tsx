import * as React from 'react';
import { observer } from 'mobx-react';
import { Store } from './store';
import { Body } from '../body';


export const Player = observer((props: PositionProps) => {
    return (
        <group>
            <Body
                name={'player'}
                color={'#ffffff'}
                isMovable={true}
                getInstance={body => Store.instance = body}
                position={props.position}
            />

        </group>
    );
});
