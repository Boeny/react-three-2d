import * as React from 'react';
import { Vector3 } from 'three';
import { ExternalHull } from './external-hull';
import { SecondDeck } from './second-deck';
import { RollingCircle } from './rolling-circle';
import { FirstDeck } from './first-deck';
import { Reactor } from './reactor';
import { Terminal } from './terminal';
import { Rapport } from './rapport';
import { Corridor } from './corridor';


const SHIP_RADIUS = 800;
const ROLLING_CIRCLE_WIDTH = 15;

const TERMINAL_RADIUS = 30;
const ROLLING_CIRCLE_RADIUS = 500;
const terminalPos = ROLLING_CIRCLE_RADIUS - TERMINAL_RADIUS;
const corridorEndPos = terminalPos - TERMINAL_RADIUS;
const FIRST_DECK_RADIUS = 50;
const PI2 = Math.PI / 2;
const PI4 = PI2 / 2;
const ARRAY_4 = [1,2,3,4];

export function Ship(props: PositionProps) {
    return (
        <ExternalHull radius={SHIP_RADIUS} {...props}>
            <SecondDeck
                radius={(SHIP_RADIUS + ROLLING_CIRCLE_RADIUS) / 2 + ROLLING_CIRCLE_WIDTH}
                width={ROLLING_CIRCLE_WIDTH}
            >
                <RollingCircle radius={ROLLING_CIRCLE_RADIUS}>
                    <Corridors />

                    <FirstDeck radius={50}>
                        <Reactor radius={10} />
                    </FirstDeck>

                    <Terminal
                        radius={TERMINAL_RADIUS}
                        position={(new Vector3(0, terminalPos, 0))}
                    />
                    <Rapport
                        radius={TERMINAL_RADIUS}
                        position={(new Vector3(0, -terminalPos, 0))}
                    />
                </RollingCircle>
            </SecondDeck>
        </ExternalHull>
    );
}


function Corridors(props: PositionProps) {
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
                angle={-PI2}
                start={FIRST_DECK_RADIUS} end={corridorEndPos}
            />
            {ARRAY_4.map(i => (
                <Corridor
                    key={i}
                    angle={PI4 + PI2 * i}
                    start={FIRST_DECK_RADIUS} end={ROLLING_CIRCLE_RADIUS}
                />
            ))}
        </group>
    );
}
