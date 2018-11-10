import * as React from 'react';
import { Vector3, Euler } from 'three';
import { getDirection3 } from '~/utils';
import { Position } from '~/types';
import { Cube } from './cube';
import { EMPTY_VECTOR3 } from '~/constants';


const BASEMENT_DEPTH = 2;
const HEAD_OFFSET = new Vector3(0, 0, BASEMENT_DEPTH);
const LEG_DISTANCE = 1;


interface Props {
    name: string;
    position: Position;
    rotation: number;
    velocity: Vector3;
    headRebound: number; // inversed vector length
}

export function Creature(props: Props) {
    const { name, rotation, headRebound } = props;
    const position = new Vector3(props.position.x, props.position.y, 0);
    const eulerAngle = new Euler(0, 0, rotation);
    return (
        <group name={name}>
            <Body
                position={position}
                rotation={eulerAngle}
            />
            <Head
                position={position.clone().add(HEAD_OFFSET)
                    .add(getDirection3(rotation).multiplyScalar(-headRebound))}
                rotation={eulerAngle}
                rebound={headRebound}
            />
        </group>
    );
}


interface BaseProps {
    position: Vector3;
    rotation: Euler;
}

const RIGTH_LEG_POSITION = new Vector3(0, LEG_DISTANCE, 0.5);
const LEFT_LEG_POSITION = new Vector3(0, -LEG_DISTANCE, 0.5);

function Body(props: BaseProps) {
    const { position, rotation } = props;
    return (
        <group
            position={position}
            rotation={rotation}
        >
            <Cube
                position={EMPTY_VECTOR3}
                width={1}
                height={1}
                depth={BASEMENT_DEPTH}
                color={'#dddddd'}
            />
            <Cube
                position={RIGTH_LEG_POSITION}
                width={1}
                height={1}
                depth={1}
                color={'#dddddd'}
            />
            <Cube
                position={LEFT_LEG_POSITION}
                width={1}
                height={1}
                depth={1}
                color={'#dddddd'}
            />
        </group>
    );
}


interface TowerProps {
    position: Vector3;
    rotation: Euler;
    rebound: number;
}

function Head(props: TowerProps) {
    const { position, rotation } = props;
    return (
        <Cube
            position={position}
            rotation={rotation}
            width={1}
            height={1}
            depth={1}
            color={'#888888'}
        />
    );
}
