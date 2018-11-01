import * as React from 'react';
import { Vector2 } from 'three';
import { Store as movable } from '../movable/store';
// import { getDifficultyLevel } from '~/utils';
import { Store as player, PlayerStore } from '../player/store';
import { IStore } from '../player/types';
import { MovableTank } from '../movable-tank';
import { BASEMENT_WIDTH } from '../tank/constants';


export class SmallTank extends React.Component {

    store = new PlayerStore({
        position: { x: 0, y: 10 },
        rotation: -Math.PI / 2
    });

    componentDidMount() {
        movable.add({ onEveryTick: getVeryEasySimpleTankScenario(this.store) });
    }

    render() {
        return (
            <MovableTank
                name={'enemy'}
                store={this.store}
            />
        );
    }
}

const getVeryEasySimpleTankScenario = (store: IStore) => () => {
    // get directions
    const distanceToPlayer = new Vector2(
        player.state.position.x - store.state.position.x,
        player.state.position.y - store.state.position.y
    );
    const directionToPlayer = distanceToPlayer.clone().normalize();
    const direction = new Vector2(Math.cos(store.state.rotation), Math.sin(store.state.rotation));
    // if diff between directions is bigger some radius - rotating
    const distance = distanceToPlayer.length();
    const shouldRotate = directionToPlayer.clone().sub(direction).length() > 0.5 * BASEMENT_WIDTH / distance;
    if (shouldRotate) {
        const normal = new Vector2(directionToPlayer.y, -directionToPlayer.x);
        store.rotate(direction.clone().dot(normal) > 0 ? 'left' : 'right');
    } else {
        store.rotate('none');
    }
    // if distance is not in range - moving
    store.moveForward(distance > 25);
    // if angle equals 0 - shooting
    store.shoot(!shouldRotate);
};

export const getEasySimpleTankScenario = (store: IStore) => () => {
    // get directions
    const distanceToPlayer = new Vector2(
        player.state.position.x - store.state.position.x,
        player.state.position.y - store.state.position.y
    );
    const directionToPlayer = distanceToPlayer.clone().normalize();
    const direction = new Vector2(Math.cos(store.state.rotation), Math.sin(store.state.rotation));
    // if diff between directions is bigger some radius - rotating
    const distance = distanceToPlayer.length();
    const shouldRotate = directionToPlayer.clone().sub(direction).length() > 0.5 * BASEMENT_WIDTH / distance;
    if (shouldRotate) {
        const normal = new Vector2(directionToPlayer.y, -directionToPlayer.x);
        store.rotate(direction.clone().dot(normal) > 0 ? 'left' : 'right');
    } else {
        store.rotate('none');
    }
    // if distance is not in range - moving
    const shouldMove = distance > 50;
    store.moveForward(shouldMove);
    // if angle equals 0 and we're in range - shooting
    store.shoot(!shouldMove && !shouldRotate);
};
