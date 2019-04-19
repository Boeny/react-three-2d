import * as React from 'react';
import { Vector3 } from 'three';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Store } from './store';
import { Cube } from '../cube';


export const Map = observer(() => {
    return (
        <group>
            <Cube position={new Vector3()} />
            {toJS(Store.data).map((item, i) => (
                <Cube
                    key={i}
                    position={new Vector3(item.position.x, item.position.y, item.position.z)}
                />
            ))}
        </group>
    );
});
