import * as React from 'react';
import { Vector3 } from 'three';
import { RollingCircle } from './rolling-circle';
import { FirstDeck } from './first-deck';
import { Reactor } from './reactor';
import { Terminal } from './terminal';
import { Rapport } from './rapport';
import { Corridor } from './corridor';


const TERMINAL_RADIUS = 30;
const ROLLING_CIRCLE_RADIUS = 500;
const terminalPos = ROLLING_CIRCLE_RADIUS - TERMINAL_RADIUS;
const corridorEndPos = terminalPos - TERMINAL_RADIUS;
const FIRST_DECK_RADIUS = 50;
const PI2 = Math.PI / 2;

interface Props {
    radius: number;
    position?: Vector3;
}

export function Ship(props: Props) {
    const position = props.position || new Vector3();
    return (
        <RollingCircle radius={ROLLING_CIRCLE_RADIUS} position={position}>
            <Corridors position={position} />

            <FirstDeck radius={50} position={position}>
                <Reactor radius={10} position={position} />
            </FirstDeck>

            <Terminal
                radius={TERMINAL_RADIUS}
                position={(new Vector3(0, terminalPos, 0)).add(position)}
            />
            <Rapport
                radius={TERMINAL_RADIUS}
                position={(new Vector3(0, -terminalPos, 0)).add(position)}
            />
        </RollingCircle>
    );
}


interface CorridorsProps {
    position: Vector3;
}

function Corridors(props: CorridorsProps) {
    const { position } = props;
    return (
        <group position={position}>
            <Corridor
                angle={0}
                start={FIRST_DECK_RADIUS} end={ROLLING_CIRCLE_RADIUS}
            />
            <Corridor
                angle={PI2}
                start={FIRST_DECK_RADIUS} end={corridorEndPos}
            />
            <Corridor
                angle={Math.PI}
                start={FIRST_DECK_RADIUS} end={ROLLING_CIRCLE_RADIUS}
            />
            <Corridor
                angle={Math.PI + PI2}
                start={FIRST_DECK_RADIUS} end={corridorEndPos}
            />
        </group>
    );
}
