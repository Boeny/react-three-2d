import * as React from 'react';
import { Vector3 } from 'three';
import { WidthRing } from '../ring';
import { Container } from '../container';


const containerRadius = 1;
const terminalWidth = 5;

interface Props {
    radius: number;
    position?: Vector3;
}

export function Terminal(props: Props) {
    const { radius } = props;
    const position = props.position || new Vector3();
    const containerPos = radius - terminalWidth - containerRadius;
    return (
        <scene>
            <WidthRing
                width={terminalWidth}
                radius={radius}
                position={position}
                color={'yellow'}
            />
            <Container radius={containerRadius} position={(new Vector3(0, containerPos, 0)).add(position)} />
            <Container radius={containerRadius} position={(new Vector3(-containerPos, 0, 0)).add(position)} />
            <Container radius={containerRadius} position={(new Vector3(0, -containerPos, 0)).add(position)} />
            <Container radius={containerRadius} position={(new Vector3(containerPos, 0, 0)).add(position)} />
        </scene>
    );
}
