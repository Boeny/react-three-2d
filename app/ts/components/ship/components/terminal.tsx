import * as React from 'react';
import { Vector3 } from 'three';
import { WidthRing, Container } from '~/components';
import { CONTAINER_RADIUS, TERMINAL_WIDTH } from '../constants';


interface Props extends PositionProps {
    radius: number;
}

export function Terminal(props: Props) {
    const { radius } = props;
    const containerPos = radius - TERMINAL_WIDTH - CONTAINER_RADIUS;
    return (
        <group position={props.position}>
            <WidthRing
                width={TERMINAL_WIDTH}
                radius={radius}
                color={'yellow'}
            />
            <Container radius={CONTAINER_RADIUS} position={(new Vector3(0, containerPos, 0))} />
            <Container radius={CONTAINER_RADIUS} position={(new Vector3(-containerPos, 0, 0))} />
            <Container radius={CONTAINER_RADIUS} position={(new Vector3(0, -containerPos, 0))} />
            <Container radius={CONTAINER_RADIUS} position={(new Vector3(containerPos, 0, 0))} />
        </group>
    );
}
