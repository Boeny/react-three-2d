import * as React from 'react';
import { Vector3 } from 'three';
import { Terminal } from './terminal';
import { Container } from './container';
import { RollingCircle } from './rolling-circle';
import { FirstDeck } from './first-deck';
import { Reactor } from './reactor';


// const SECOND_DESK_WIDTH = 2;
const TERMINAL_RADIUS = 10;
const terminalWidth = 1;
const containerRadius = 1;
const containerPos = TERMINAL_RADIUS - containerRadius;

interface Props {
    radius: number;
    position?: Vector3;
}

export function Ship(props: Props) {
    const { radius } = props;
    const position = props.position || new Vector3();
    const terminalPos = position.sub(new Vector3());
    return (
        <RollingCircle radius={radius + 10} position={position}>
            <FirstDeck radius={30} position={position}>
                <Reactor radius={10} position={position} />
            </FirstDeck>

            <Terminal radius={TERMINAL_RADIUS + terminalWidth} position={terminalPos}>
                <Container position={(new Vector3(0, containerPos, 0)).add(position)} />
                <Container position={(new Vector3(-containerPos, 0, 0)).add(position)} />
                <Container position={(new Vector3(0, -containerPos, 0)).add(position)} />
                <Container position={(new Vector3(containerPos, 0, 0)).add(position)} />
            </Terminal>
        </RollingCircle>
    );
}
