import * as React from 'react';
import { Vector3 } from 'three';
import { toJS } from 'mobx';
import { observer } from 'mobx-react';
import { Store } from './store';
import { Cube } from '../cube';


export const Map = observer(() => {
    const { data, selected } = Store;
    return (
        <group>
            <Cube position={new Vector3()} />
            {toJS(data).map((item, i) => (
                <Cube
                    key={i}
                    name={String(i)}
                    color={selected !== null && selected.name === String(i) ? 'red' : 'white'}
                    position={new Vector3(item.position.x, item.position.y, item.position.z)}
                />
            ))}
        </group>
    );
});
