import * as React from 'react';
import { Vector2, Vector3 } from 'three';
import { observer } from 'mobx-react';
import { Store as movable } from './movable/store';
import { getSign, getDirection, sub, length, add } from '~/utils';
import { Position } from '~/types';
import { IStore as BulletsStore } from './tank/bullet/types';
import { VertDirection, HorDirection, IStore as PlayerStore } from './player/types';
import { Tank } from './tank';
import { MAX_SPEED, MIN_SPEED } from '../constants';
import {
    STEPS_IN_UNIT, STEPS_IN_SINGLE_TRACK, TRACK_DISTANCE, BASEMENT_LENGTH, BASEMENT_WIDTH
} from './tank/constants';


const SHOOTING_DELAY = 500; // 5-6 sec
const MIN_DISTANCE = new Vector2(BASEMENT_LENGTH, BASEMENT_WIDTH).length();

const MAX_MOVE_SPEED = MAX_SPEED / 2;
const MIN_MOVE_SPEED = 0;
const ACCELERATION = MIN_SPEED * 1.5;
const DECELERATION = MIN_SPEED * 1.05;

const REBOUND_INITIAL_SPEED = MIN_SPEED * 2;
const REBOUND_ACCELERATION = MIN_SPEED * 0.5;
const MAX_REBOUND = 0.15;

const DEGREE = Math.PI / 180;
const MAX_ROT_SPEED = DEGREE * 5;
const MIN_ROT_SPEED = 0;
const ROT_SPEED_ACC = DEGREE * 1.25;
const ROT_SPEED_DEC = DEGREE * 1.05;


type Offset = { left: number, right: number };

interface Props {
    name: string;
    store: PlayerStore;
    onPositionUpdate?: (p: Position) => void;
}

interface State {
    towerRebound: number;
}

@observer
export class MovableTank extends React.Component<Props, State> {

    bullets: BulletsStore | null = null;
    offset: Offset = { left: 0, right: 0 };
    state: State = { towerRebound: 0 };
    towerReboundingSpeed = 0;

    constructor(props: Props) {
        super(props);
        this.setOffset();
    }

    componentDidMount() {
        const { name, store, onPositionUpdate } = this.props;
        const shooting = this.getShooting(store);
        const onEveryTick = getOnEveryTick(name, store, onPositionUpdate);
        movable.add({
            name,
            state: this.props.store.state,
            onEveryTick: (deltaTime: number) => {
                shooting();
                this.towerRebounding();
                onEveryTick(deltaTime, this.offset);
            }
        });
    }

    getShooting = (store: PlayerStore) => () => {
        if (this.bullets && store.canShoot && store.isShooting()) {
            this.bullets.add();
            store.canShoot = false;
            setTimeout(() => store.canShoot = true, SHOOTING_DELAY);
            this.towerReboundingSpeed = REBOUND_INITIAL_SPEED;
        }
    }

    towerRebounding = () => {
        if (this.towerReboundingSpeed === 0) {
            return;
        }
        if (this.towerReboundingSpeed < 0) {
            this.towerReboundingSpeed -= REBOUND_ACCELERATION;
        }
        const nextRebound = this.state.towerRebound + this.towerReboundingSpeed;
        if (nextRebound < 0) {
            this.towerReboundingSpeed = 0;
            this.setState({ towerRebound: 0 });
            return;
        }
        if (nextRebound > MAX_REBOUND) {
            this.towerReboundingSpeed = -this.towerReboundingSpeed;
            this.setState({ towerRebound: MAX_REBOUND });
            return;
        }
        this.setState({ towerRebound: nextRebound });
    }

    setOffset = () => {
        this.offset.left = Math.random() * 3;
        this.offset.right = this.offset.left - 1;
    }

    setBullets = (bullets: BulletsStore | null) => {
        this.bullets = bullets;
    }

    render() {
        const { store, name } = this.props;
        const { state, velocity } = store;
        const { towerRebound } = this.state;
        return (
            <Tank
                name={name}
                position={state.position}
                rotation={state.rotation}
                trackOffset={this.offset}
                velocity={new Vector3(velocity.x, velocity.y, 0)}
                towerRebound={towerRebound}
                onBulletsRef={this.setBullets}
            />
        );
    }
}

const getOnEveryTick = (
    currentName: string, store: PlayerStore, onPositionUpdate?: (p: Position) => void
) => (_: number, offset: Offset) => {
    // change position by velocity
    if (store.isMoving()) {
        store.velocity.add(getMovingAcceleration(store.moving, getDirection(store.state.rotation)));
    }
    let speed = store.velocity.length();
    if (store.velocity.x !== 0 || store.velocity.y !== 0) {
        speed = decreaseSpeed(speed, DECELERATION);
        store.velocity.normalize().multiplyScalar(speed);
    }
    if (speed > MAX_MOVE_SPEED) {
        store.velocity.normalize().multiplyScalar(MAX_MOVE_SPEED);
        speed = MAX_MOVE_SPEED;
    } else if (speed < MIN_MOVE_SPEED) {
        store.velocity = new Vector2();
        speed = 0;
    }
    // calc track offset if we're moving
    let deltaOffset = Math.round(speed * STEPS_IN_UNIT);
    if (speed > 0) {
        if (store.moving.up) {
            deltaOffset = STEPS_IN_SINGLE_TRACK - deltaOffset % STEPS_IN_SINGLE_TRACK;
        }
        offset.left = offset.right = (offset.left + deltaOffset) % STEPS_IN_SINGLE_TRACK;
    }
    if (speed > 0) {
        // check if next position crosses some object
        let nextPosition = add(store.state.position, store.velocity);
        for (let i = 0; i < movable.data.length; i += 1) {
            const { name, state } = movable.data[i];
            if (state && name && name !== currentName) {
                const distVector = sub(state.position, store.state.position);
                if (length(sub(state.position, nextPosition)) < MIN_DISTANCE) {
                    const d = length(distVector);
                    store.velocity.normalize().multiplyScalar(getRoot(
                        -store.velocity.dot(new Vector2(distVector.x, distVector.y)) / speed,
                        d * d - MIN_DISTANCE * MIN_DISTANCE
                    ));
                    speed = store.velocity.length();
                    nextPosition = add(store.state.position, store.velocity);
                }
            }
        }
        store.setPosition(nextPosition, onPositionUpdate);
    }
    // change rotation by rotation speed
    if (store.isRotating()) {
        store.rotSpeed += getRotationAcceleration(store.rotating);
    }
    const sign = getSign(store.rotSpeed);
    speed = Math.abs(store.rotSpeed);
    if (store.rotSpeed !== 0) {
        speed = decreaseSpeed(speed, ROT_SPEED_DEC);
        store.rotSpeed = sign * speed;
    }
    if (speed > MAX_ROT_SPEED) {
        store.rotSpeed = MAX_ROT_SPEED * sign;
        speed = MAX_ROT_SPEED;
    } else if (speed < MIN_ROT_SPEED) {
        store.rotSpeed = 0;
        speed = 0;
    }
    // calc track offset if we're rotating
    deltaOffset = Math.round(Math.tan(speed) * TRACK_DISTANCE * STEPS_IN_UNIT);
    if (speed > 0) {
        if (store.rotating.left) {
            offset.left = (offset.left + (STEPS_IN_SINGLE_TRACK - deltaOffset % STEPS_IN_SINGLE_TRACK)) % STEPS_IN_SINGLE_TRACK;
            offset.right = (offset.right + deltaOffset) % STEPS_IN_SINGLE_TRACK;
        } else {
            offset.right = (offset.right + (STEPS_IN_SINGLE_TRACK - deltaOffset % STEPS_IN_SINGLE_TRACK)) % STEPS_IN_SINGLE_TRACK;
            offset.left = (offset.left + deltaOffset) % STEPS_IN_SINGLE_TRACK;
        }
    }
    if (speed > 0) {
        store.setRotation(store.state.rotation + store.rotSpeed);
    }
};

function decreaseSpeed(vel: number, acc: number): number {
    return vel > acc || vel < -acc ? Math.abs(vel - acc) : 0;
}

function getMovingAcceleration({ up, down }: VertDirection, direction: Vector2): Vector2 {
    return direction.multiplyScalar(up ? ACCELERATION : (down ? -ACCELERATION : 0));
}

function getRotationAcceleration({ left, right }: HorDirection): number {
    return right ? -ROT_SPEED_ACC : (left ? ROT_SPEED_ACC : 0);
}

function getRoot(b: number, c: number): number {
    const D = b * b - c;
    if (D < 0) {
        console.warn('D < 0!');
        return 0;
    }
    return -b - Math.sqrt(D);
}
