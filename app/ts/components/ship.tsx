import * as React from 'react';
import { Vector3 } from 'three';
// import { WidthRing } from './ring';
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
    props.radius;
    return (
        <RollingCircle radius={100 + 2}>
            <FirstDeck>
                <Reactor />
            </FirstDeck>

            <Terminal radius={TERMINAL_RADIUS + terminalWidth} position={100 - TERMINAL_RADIUS}>
                <Container position={new Vector3(0, containerPos, 0)} />
                <Container position={new Vector3(-containerPos, 0, 0)} />
                <Container position={new Vector3(0, -containerPos, 0)} />
                <Container position={new Vector3(containerPos, 0, 0)} />
            </Terminal>
        </RollingCircle>
    );
}
