import * as React from 'react';
import { observer } from 'mobx-react';
import { Vector3 } from 'three';
import { Store } from './store';
import { Sphere } from '../sphere';


export const Map = observer(() => {
    return (
        <group>
            <Sphere radius={1} position={new Vector3()} />
            {Store.data.map(item => (
                <Sphere {...item} />
            ))}
        </group>
    );
});
