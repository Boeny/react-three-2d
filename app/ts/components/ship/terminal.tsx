import * as React from 'react';
import { Vector3 } from 'three';
import { WidthRing } from '../ring';
import { Container } from '../container';


const containerRadius = 1;
const terminalWidth = 5;

interface Props extends PositionProps {
    radius: number;
}

export function Terminal(props: Props) {
    const { radius } = props;
    const containerPos = radius - terminalWidth - containerRadius;
    return (
        <group position={props.position}>
            <WidthRing
                width={terminalWidth}
                radius={radius}
                color={'yellow'}
            />
            <Container radius={containerRadius} position={(new Vector3(0, containerPos, 0))} />
            <Container radius={containerRadius} position={(new Vector3(-containerPos, 0, 0))} />
            <Container radius={containerRadius} position={(new Vector3(0, -containerPos, 0))} />
            <Container radius={containerRadius} position={(new Vector3(containerPos, 0, 0))} />
        </group>
    );
}
