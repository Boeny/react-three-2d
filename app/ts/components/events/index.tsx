import * as React from 'react';
import { Vector2 } from 'three';
import { observer } from 'mobx-react';
import { Store } from './store';
import { Mode } from './types';
import { Box } from '../box';
import { Particle } from '../particle';


export function Events(props: PositionProps) {
    const position = props.position || new Vector2();
    return (
        <Box
            isStatic={true}
            hasCollider={true}
            color={'blue'}
            width={20}
            position={position}
        >
            <Content position={(new Vector2(1, 1)).add(position)} />
        </Box>
    );
}


const Content = observer((props: PositionProps) => {
    return (
        <group>
            <MouseMode
                mode={Store.state.mouseMode}
                position={props.position}
            />
        </group>
    );
});

function MouseMode(props: PositionProps & { mode: Mode }) {
    const { mode, position } = props;
    return (
        <Particle
            x={position ? position.x : 0}
            y={position ? position.y : 0}
            color={getColorByMode(mode)}
        />
    );
}

function getColorByMode(mode: Mode): string {
    switch (mode) {
        case 'idle': return 'blue';
        case 'drag': return 'orange';
    }
}
