import * as React from 'react';
import { Vector3 } from 'three';
import { observer } from 'mobx-react';
import { Store } from './store';
import { createArray } from '~/utils';
import { getPositionByCoo } from './utils';
import { Cube } from '../cube';
import { WIDTH_SCALE } from '~/constants';
import { INITIAL_VALUE } from './constants';


export const LocalMap = observer(() => {
    const { data, currentCoo } = Store.state;
    const position = getPositionByCoo(currentCoo);
    const count = data[currentCoo] || 0;
    const width = WIDTH_SCALE / Math.sqrt(INITIAL_VALUE);
    return (
        <group>
            {createArray(count).map(i => (
                <Cube
                    key={i}
                    position={new Vector3(
                        position.x + getRandomCoordinate(width),
                        position.y + getRandomCoordinate(width),
                        0
                    )}
                    width={width}
                    height={width}
                    depth={width}
                    color={'#ffffff'}
                />
            ))}
        </group>
    );
});

function getRandomCoordinate(width: number) {
    return WIDTH_SCALE * width * (Math.floor(Math.random() / width) + 0.5);
}
