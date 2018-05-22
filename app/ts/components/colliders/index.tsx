import * as React from 'react';
import { observer } from 'mobx-react';
import { Store } from './store';
import { IBodyStore } from './types';
import { Particle } from '../particle';
import { SHOW_COLLIDERS } from '~/constants';


export const Colliders = observer(() => {
    if (SHOW_COLLIDERS === false) {
        return null;
    }
    return (
        <group>
            {Store.colliders.map((item, i) => (
                <Item key={i} item={item} />
            ))}
        </group>
    );
});


interface Props {
    item: IBodyStore;
}

const Item = observer((props: Props) => {
    const { item } = props;
    // hack to observe this
    item.position.x;
    item.position.y;
    return (
        <Particle
            position={item.position}
            color={'#000000'}
            borderColor={item.isMovable ? 'yellow' : '#00ff00'}
            borderOnly={true}
            zIndex={1.25}
        />
    );
});
