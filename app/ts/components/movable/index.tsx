import * as React from 'react';
import { Vector2 } from 'three';
// import { observer } from 'mobx-react';
import { Store } from './store';
import { Box } from '../box';
import { Particle } from '../particle';


export function Movable(props: PositionProps) {
    return (
        <Box
            isStatic={true}
            hasCollider={true}
            color={'grey'}
            width={20}
            height={10}
            position={props.position}
        >
            <Content {...props} />
        </Box>
    );
}


const Content = (props: PositionProps) => {
    const position = props.position || new Vector2();
    const { bodies } = Store;
    return (
        <group>
            {bodies.map((body, i) => body && (
                <Particle
                    key={i}
                    x={position.x + i - bodies.length}
                    y={position.y}
                    color={'grey'}
                />
            ))}
        </group>
    );
};
