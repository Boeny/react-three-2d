import * as React from 'react';
import { observer } from 'mobx-react';
import { Store } from './store';
import { Position } from '~/types';
import { IBodyStore } from './types';
import { Particle } from '../particle';
import { SHOW_COLLIDERS } from '~/constants';


export const Colliders = observer(() => {
    if (SHOW_COLLIDERS === false) {
        return null;
    }
    const { colliders } = Store.state;
    return (
        <group>
            {Object.keys(colliders).map((coo, i) => {
                return (
                    colliders[coo] ?
                        <Item
                            key={i}
                            item={colliders[coo] as IBodyStore}
                            position={{
                                x: parseInt(coo.split('|')[0], 10),
                                y: parseInt(coo.split('|')[1], 10)
                            }}
                        />
                    : null
                );
            })}
        </group>
    );
});


interface Props {
    position: Position;
    item: IBodyStore;
}

const Item = ((props: Props) => {
    const { item, position } = props;
    return (
        <Particle
            position={position}
            color={'#000000'}
            borderColor={item.isMovable ? 'yellow' : '#00ff00'}
            borderOnly={true}
            zIndex={1.25}
        />
    );
});
