import * as React from 'react';
import { Vector3 } from 'three';
import { observer } from 'mobx-react';
import { Store } from './store';
import { getPositionByCoo } from './utils';
import { MountAndInit } from '../mount-and-init';
import { Cube } from '../cube';
import { LOCAL_WIDTH } from './constants';


const LocalMapComponent = observer(() => {
    const { currentCoo, local } = Store.state;
    const position = getPositionByCoo(currentCoo);
    const localData = local[currentCoo] || {};
    return (
        <group>
            {Object.keys(localData).map((coo, i) => {
                const localPos = getPositionByCoo(coo);
                return (
                    <Cube
                        key={`${i}-${coo}`}
                        position={new Vector3(
                            position.x + (localPos.x + 0.5) * LOCAL_WIDTH,
                            position.y + (localPos.y + 0.5) * LOCAL_WIDTH,
                            0
                        )}
                        width={LOCAL_WIDTH}
                        height={LOCAL_WIDTH}
                        depth={LOCAL_WIDTH / 2}
                        color={'#ffffff'}
                    />
                );
            })}
        </group>
    );
});


export const LocalMap = observer(() => {
    const { mode } = Store.state;
    if (mode < 2) {
        return null;
    }
    return (
        <MountAndInit
            component={<LocalMapComponent />}
            onMount={() => Store.initLocal()}
        />
    );
});
