import * as React from 'react';
import { Vector2, Vector3 } from 'three';
import { observer } from 'mobx-react';
import { Store as movable } from './movable/store';
import { getSign } from '~/utils';
import { Position } from '~/types';
import { IStore as BulletsStore } from './tank/bullet/types';
import { VertDirection, HorDirection, IStore as PlayerStore } from './player/types';
import { Tank } from './tank';
import { MAX_SPEED, MIN_SPEED } from '../constants';
import { STEPS_IN_UNIT, STEPS_IN_SINGLE_TRACK, TRACK_DISTANCE } from './tank/constants';


const MAX_MOVE_SPEED = MAX_SPEED / 2;
const MIN_MOVE_SPEED = 0;
const ACCELERATION = MIN_SPEED * 1.5;
const DECELERATION = MIN_SPEED * 1.05;

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

@observer
export class MovableTank extends React.Component<Props> {

    bullets: BulletsStore | null = null;
    offset: Offset = { left: 0, right: 0 };

    constructor(props: Props) {
        super(props);
        this.setOffset();
    }

    componentDidMount() {
        const { store } = this.props;
        const onEveryTick = getOnEveryTick(this.props.store, this.props.onPositionUpdate);
        movable.add({
            onEveryTick: (deltaTime: number) => {
                if (this.bullets && store.canShoot && store.isShooting()) {
                    this.bullets.add();
                    store.canShoot = false;
                    setTimeout(() => store.canShoot = true, 200);
                }
                onEveryTick(deltaTime, this.offset);
            }
        });
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
        return (
            <Tank
                name={name}
                position={state.position}
                rotation={state.rotation}
                trackOffset={this.offset}
                velocity={new Vector3(velocity.x, velocity.y, 0)}
                onBulletsRef={this.setBullets}
            />
        );
    }
}

const getOnEveryTick = (
    store: PlayerStore, onPositionUpdate?: (p: Position) => void
) => (deltaTime: number, offset: Offset) => {
    // change position by velocity
    if (store.isMoving()) {
        store.velocity.add(getMovingAcceleration(store.moving, store.state.rotation));
    }
    let length = store.velocity.length();
    if (store.velocity.x !== 0 || store.velocity.y !== 0) {
        length = decreaseSpeed(length, DECELERATION);
        store.velocity.normalize().multiplyScalar(length);
    }
    if (length > MAX_MOVE_SPEED) {
        store.velocity.normalize().multiplyScalar(MAX_MOVE_SPEED);
        length = MAX_MOVE_SPEED;
    } else if (length < MIN_MOVE_SPEED) {
        store.velocity = new Vector2();
        length = 0;
    }
    if (length > 0) {
        store.setPosition(
            {
                x: store.state.position.x + store.velocity.x * deltaTime,
                y: store.state.position.y + store.velocity.y * deltaTime
            },
            onPositionUpdate
        );
    }
    // calc track offset if we're moving
    let deltaOffset = Math.round(length * STEPS_IN_UNIT * deltaTime);
    if (length > 0) {
        if (store.moving.up) {
            deltaOffset = STEPS_IN_SINGLE_TRACK - deltaOffset % STEPS_IN_SINGLE_TRACK;
        }
        offset.left = offset.right = (offset.left + deltaOffset) % STEPS_IN_SINGLE_TRACK;
    }
    // change rotation by rotation speed
    if (store.isRotating()) {
        store.rotSpeed += getRotationAcceleration(store.rotating);
    }
    const sign = getSign(store.rotSpeed);
    length = Math.abs(store.rotSpeed);
    if (store.rotSpeed !== 0) {
        length = decreaseSpeed(length, ROT_SPEED_DEC);
        store.rotSpeed = sign * length;
    }
    if (length > MAX_ROT_SPEED) {
        store.rotSpeed = MAX_ROT_SPEED * sign;
        length = MAX_ROT_SPEED;
    } else if (length < MIN_ROT_SPEED) {
        store.rotSpeed = 0;
        length = 0;
    }
    if (length > 0) {
        store.setRotation(store.state.rotation + store.rotSpeed * deltaTime);
    }
    // calc track offset if we're rotating
    deltaOffset = Math.round(Math.tan(length * deltaTime) * TRACK_DISTANCE * STEPS_IN_UNIT);
    if (length > 0) {
        if (store.rotating.left) {
            offset.left = (offset.left + (STEPS_IN_SINGLE_TRACK - deltaOffset % STEPS_IN_SINGLE_TRACK)) % STEPS_IN_SINGLE_TRACK;
            offset.right = (offset.right + deltaOffset) % STEPS_IN_SINGLE_TRACK;
        } else {
            offset.right = (offset.right + (STEPS_IN_SINGLE_TRACK - deltaOffset % STEPS_IN_SINGLE_TRACK)) % STEPS_IN_SINGLE_TRACK;
            offset.left = (offset.left + deltaOffset) % STEPS_IN_SINGLE_TRACK;
        }
    }
};

function decreaseSpeed(vel: number, acc: number): number {
    return vel > acc || vel < -acc ? Math.abs(vel - acc) : 0;
}

function getMovingAcceleration({ up, down }: VertDirection, rot: number): Vector2 {
    return (new Vector2(Math.cos(rot), Math.sin(rot)))
        .multiplyScalar(up ? ACCELERATION : (down ? -ACCELERATION : 0));
}

function getRotationAcceleration({ left, right }: HorDirection): number {
    return right ? -ROT_SPEED_ACC : (left ? ROT_SPEED_ACC : 0);
}
