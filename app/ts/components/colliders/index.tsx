import * as React from 'react';
import { observer } from 'mobx-react';
import { Store } from './store';
import { Container } from '../container';


export const Colliders = observer((props: PositionProps) => {
    return (
        <Container
            borderColor={'green'}
            data={Store.colliders.map(s => s.store)}
            position={props.position}
        />
    );
});
