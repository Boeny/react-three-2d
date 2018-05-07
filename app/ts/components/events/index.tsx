import * as React from 'react';
import * as constants from '../camera/constants';
import { Vector2 } from 'three';
import { observer } from 'mobx-react';
import { Store } from './store';
import { Mode } from './types';
import { Box } from '../box';
import { Particle } from '../particle';
import { Container } from '../container';


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


interface Props {
    position: Vector2;
}

const Content = observer((props: Props) => {
    return (
        <group>
            <MouseMode position={(new Vector2(5, 1)).add(props.position)} />
            <Container
                borderColor={'grey'}
                data={Object.keys(constants).map(name => ({
                    name,
                    color: 'grey'
                }))}
                position={props.position}
            />
        </group>
    );
});

const MouseMode = observer((props: PositionProps) => {
    const { position } = props;
    return (
        <Particle
            x={position ? position.x : 0}
            y={position ? position.y : 0}
            color={getColorByMode(Store.state.mouseMode)}
        />
    );
});

function getColorByMode(mode: Mode): string {
    switch (mode) {
        case 'idle': return 'blue';
        case 'drag': return 'orange';
    }
}
