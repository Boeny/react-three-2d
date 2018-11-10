import * as React from 'react';
import { Vector3, Euler } from 'three';
import { getDirection3 } from '~/utils';
import { Position } from '~/types';
import { IStore as BulletsStore } from './bullet/types';
import { Cube } from '../cube';
import { Track } from './track';
import { Bullets } from './bullet';
import { BASEMENT_LENGTH, TRACK_DISTANCE, EMPTY_VECTOR3, BASEMENT_WIDTH } from './constants';


const BASEMENT_DEPTH = 0.75;
const TOWER_OFFSET = new Vector3(0, 0, BASEMENT_DEPTH);
const BARREL_OFFSET = new Vector3(1, 0, 0.0625);
const BARREL_LENGTH = 2;


type Offset = { left: number, right: number };

interface Props {
    name: string;
    position: Position;
    rotation: number;
    velocity: Vector3;
    trackOffset: Offset;
    towerRebound: number; // inversed vector length
    onBulletsRef: (b: BulletsStore | null) => void;
}

export function Tank(props: Props) {
    const { name, rotation, velocity, trackOffset, onBulletsRef, towerRebound } = props;
    const position = new Vector3(props.position.x, props.position.y, 0);
    const eulerAngle = new Euler(0, 0, rotation);
    const barrelRelativePosition = getDirection3(rotation).multiplyScalar(1 + BARREL_LENGTH / 2);
    return (
        <group name={name}>
            <Basement
                position={position}
                rotation={eulerAngle}
                trackOffset={trackOffset}
            />
            <Tower
                position={position.clone().add(TOWER_OFFSET)
                    .add(getDirection3(rotation).multiplyScalar(-towerRebound))}
                rotation={eulerAngle}
                rebound={towerRebound}
            />
            <Bullets
                position={barrelRelativePosition.clone().add(position).add(TOWER_OFFSET)}
                velocity={velocity}
                direction={barrelRelativePosition.clone()}
                rotation={new Vector3(0, 0, rotation)}
                onRef={onBulletsRef}
            />
        </group>
    );
}


interface BaseProps {
    position: Vector3;
    rotation: Euler;
    trackOffset: Offset;
}

const RIGTH_TRACK_POSITION = new Vector3(0, TRACK_DISTANCE, 0.5);
const LEFT_TRACK_POSITION = new Vector3(0, -TRACK_DISTANCE, 0.5);

function Basement(props: BaseProps) {
    const { position, rotation, trackOffset } = props;
    return (
        <group
            position={position}
            rotation={rotation}
        >
            <Cube
                position={EMPTY_VECTOR3}
                width={BASEMENT_LENGTH}
                height={BASEMENT_WIDTH}
                depth={BASEMENT_DEPTH}
                color={'#dddddd'}
            />
            <Track
                position={RIGTH_TRACK_POSITION}
                offset={trackOffset.right}
            />
            <Track
                position={LEFT_TRACK_POSITION}
                offset={trackOffset.left}
            />
        </group>
    );
}


interface TowerProps {
    position: Vector3;
    rotation: Euler;
    rebound: number;
}

const TOWER_HATCH_POSITION = new Vector3(-0.16, 0.16, 0.25);

function Tower(props: TowerProps) {
    const { position, rotation, rebound } = props;
    return (
        <group
            position={position}
            rotation={rotation}
        >
            <Cube
                position={EMPTY_VECTOR3}
                width={1}
                height={0.9}
                depth={0.5}
                color={'#888888'}
            />
            <Cube // barrel
                position={BARREL_OFFSET}
                width={BARREL_LENGTH - 2 * rebound}
                height={0.25}
                depth={0.25}
                color={'#777777'}
            />
            <Cube // hatch
                position={TOWER_HATCH_POSITION}
                width={0.375}
                height={0.375}
                depth={0.0625}
                color={'#555555'}
            />
        </group>
    );
}
