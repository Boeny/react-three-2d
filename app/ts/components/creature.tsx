import * as React from 'react';
import { Vector3, Euler } from 'three';
import { getDirection3 } from '~/utils';
import { Position } from '~/types';
import { Cube } from './cube';


const BODY_DEPTH = 2;
const LEGS_DEPTH = BODY_DEPTH;
const BODY_OFFSET = new Vector3(0, 0, LEGS_DEPTH + BODY_DEPTH / 2);
const HEAD_OFFSET = new Vector3(0, 0, LEGS_DEPTH + BODY_DEPTH + 0.5);

const HANDS_OFFSET = new Vector3(0, 0, LEGS_DEPTH + BODY_DEPTH - 0.5);
const RIGTH_ARM_POSITION = new Vector3(1, 1, 0);
const LEFT_ARM_POSITION = new Vector3(1, -1, 0);

const LEGS_OFFSET = new Vector3(0, 0, 0.5);
const RIGTH_LEG_POSITION = new Vector3(0, 1, 0);
const LEFT_LEG_POSITION = new Vector3(0, -1, 0);


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
    rotation?: Euler;
}

function Body(props: BaseProps) {
    const { position, rotation } = props;
    return (
        <group
            position={position}
            rotation={rotation}
        >
            <Cube
                position={BODY_OFFSET}
                width={1}
                height={1}
                depth={BODY_DEPTH}
                color={'#ffffff'}
            />
            <Hands position={HANDS_OFFSET} />
            <Legs position={LEGS_OFFSET} />
        </group>
    );
}


interface HeadProps extends BaseProps {
    rebound: number;
}

function Head(props: HeadProps) {
    return (
        <Cube
            {...props}
            width={1}
            height={1}
            depth={1}
            color={'#999999'}
        />
    );
}


function Legs(props: BaseProps) {
    return (
        <group {...props} >
            <Cube
                position={RIGTH_LEG_POSITION}
                width={1}
                height={1}
                depth={1}
                color={'#888888'}
            />
            <Cube
                position={LEFT_LEG_POSITION}
                width={1}
                height={1}
                depth={1}
                color={'#888888'}
            />
        </group>
    );
}

function Hands(props: BaseProps) {
    return (
        <group {...props} >
            <Cube
                position={RIGTH_ARM_POSITION}
                width={1}
                height={1}
                depth={1}
                color={'#888888'}
            />
            <Cube
                position={LEFT_ARM_POSITION}
                width={1}
                height={1}
                depth={1}
                color={'#888888'}
            />
        </group>
    );
}
