import * as React from 'react';
import { getPlayerStore } from '../player/store';
import { MovableTank } from '../movable-tank';


const Store = getPlayerStore({
    position: { x: 0, y: 10 },
    rotation: -Math.PI / 2
});

export function SmallTank() {
    return (
        <MovableTank
            name={'enemy'}
            store={Store}
        />
    );
}
