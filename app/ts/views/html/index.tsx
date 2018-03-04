import * as React from 'react';
import { Store as PlanetStore } from '~/components/planet/store';
import { setPlanet } from './actions';


export const Html = () => (
    <div
        style={{
            ...PlanetStore.style,
            position: 'absolute',
            width: 200
        }}
        ref={setPlanet}
    >
        planet color
    </div>
);
