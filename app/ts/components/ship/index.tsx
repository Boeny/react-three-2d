import * as React from 'react';
import { Vector3 } from 'three';
import {
    ExternalHull, SecondDeck, RollingCircle, FirstDeck, Reactor, Terminal, Rapport, Corridor
} from './components';
import { PI2, PI4, ARRAY_4 } from '~/constants';
import {
    SHIP_RADIUS, ROLLING_CIRCLE_WIDTH, TERMINAL_RADIUS, ROLLING_CIRCLE_RADIUS, terminalPos,
    corridorEndPos, FIRST_DECK_RADIUS
} from './constants';


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
