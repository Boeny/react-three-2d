import * as React from 'react';
import { Vector2 } from 'three';
import { Store as movable } from '../movable/store';
import { getDirection, getAngle } from '~/utils';
import { Store as player, PlayerStore } from '../player/store';
import { Position } from '~/types';
import { IStore } from '../player/types';
import { MovableCreature } from '../movable-creature';


interface Props {
    name: string;
    position: Position;
}

export class Enemy extends React.Component<Props> {

    store: PlayerStore;

    constructor(props: Props) {
        super(props);
        const { position } = props;
        this.store = new PlayerStore({
            position,
            rotation: this.rotateTo(player.state.position, position)
        });
    }

    rotateTo(target: Position, position: Position): number {
        const direction = new Vector2(
            target.x - position.x,
            target.y - position.y
        ).normalize();
        return getAngle(direction.x, direction.y);
    }

    componentDidMount() {
        movable.add({ onEveryTick: getVeryEasyScenario(this.store) });
    }

    render() {
        return (
            <MovableCreature
                name={this.props.name}
                store={this.store}
            />
        );
    }
}

const getVeryEasyScenario = (store: IStore) => () => {
    // get directions
    const distanceToPlayer = new Vector2(
        player.state.position.x - store.state.position.x,
        player.state.position.y - store.state.position.y
    );
    const directionToPlayer = distanceToPlayer.clone().normalize();
    const direction = getDirection(store.state.rotation);
    // if diff between directions is bigger some radius - rotating
    const distance = distanceToPlayer.length();
    const shouldRotate = directionToPlayer.clone().sub(direction).length() > 0.5 / distance;
    if (shouldRotate) {
        const normal = new Vector2(directionToPlayer.y, -directionToPlayer.x);
        store.rotate(direction.clone().dot(normal) > 0 ? 'left' : 'right');
    } else {
        store.rotate('none');
    }
    // if distance is not in range - moving
    store.moveForward(distance > 25);
    // if angle equals 0 - shooting
    store.strike(!shouldRotate);
};
