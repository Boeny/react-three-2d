import * as React from 'react';
import { Vector2 } from 'three';
import { Store as player, getPlayerStore } from '../player/store';
import { MovableTank } from '../movable-tank';
import { BASEMENT_WIDTH } from '../tank/constants';


const Store = getPlayerStore(
    {
        position: { x: 0, y: 10 },
        rotation: -Math.PI / 2
    },
    getVeryEasySimpleTankScenario
);


export function SmallTank() {
    return (
        <MovableTank
            name={'enemy'}
            store={Store}
        />
    );
}

function getVeryEasySimpleTankScenario() {
    // get directions
    const distanceToPlayer = new Vector2(
        player.state.position.x - Store.state.position.x,
        player.state.position.y - Store.state.position.y
    );
    const directionToPlayer = distanceToPlayer.clone().normalize();
    const direction = new Vector2(Math.cos(Store.state.rotation), Math.sin(Store.state.rotation));
    // if diff between directions is bigger some radius - rotating
    const distance = distanceToPlayer.length();
    const shouldRotate = directionToPlayer.clone().sub(direction).length() > 0.5 * BASEMENT_WIDTH / distance;
    if (shouldRotate) {
        const normal = new Vector2(directionToPlayer.y, -directionToPlayer.x);
        Store.rotate(direction.clone().dot(normal) > 0 ? 'left' : 'right');
    } else {
        Store.rotate('none');
    }
    // if distance is not in range - moving
    Store.moveForward(distance > 25);
    // if angle equals 0 - shooting
    Store.shoot(!shouldRotate);
}

export function getEasySimpleTankScenario() {
    // get directions
    const distanceToPlayer = new Vector2(
        player.state.position.x - Store.state.position.x,
        player.state.position.y - Store.state.position.y
    );
    const directionToPlayer = distanceToPlayer.clone().normalize();
    const direction = new Vector2(Math.cos(Store.state.rotation), Math.sin(Store.state.rotation));
    // if diff between directions is bigger some radius - rotating
    const distance = distanceToPlayer.length();
    const shouldRotate = directionToPlayer.clone().sub(direction).length() > 0.5 * BASEMENT_WIDTH / distance;
    if (shouldRotate) {
        const normal = new Vector2(directionToPlayer.y, -directionToPlayer.x);
        Store.rotate(direction.clone().dot(normal) > 0 ? 'left' : 'right');
    } else {
        Store.rotate('none');
    }
    // if distance is not in range - moving
    const shouldMove = distance > 50;
    Store.moveForward(shouldMove);
    // if angle equals 0 and we're in range - shooting
    Store.shoot(!shouldMove && !shouldRotate);
}
