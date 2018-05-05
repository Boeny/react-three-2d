import * as React from 'react';
import { Vector2 } from 'three';
import { observer } from 'mobx-react';
import { Store } from './store';
import { Box } from '../box';
import { Particle } from '../particle';


const WIDTH = 20;

export function Colliders(props: PositionProps) {
    const height = Math.floor((Store.colliders.length - 1) / WIDTH);
    return (
        <Box
            isStatic={true}
            hasCollider={true}
            color={'green'}
            width={WIDTH + 1}
            height={height + 2}
            position={props.position}
        >
            <Content {...props} height2={Math.floor(height / 2)} />
        </Box>
    );
}


const Content = observer((props: PositionProps & { height2: number }) => {
    const position = props.position || new Vector2();
    const { colliders } = Store;
    return (
        <group>
            {colliders.map((c, i) => (
                <Particle
                    key={i}
                    x={position.x - WIDTH / 2 + (i % WIDTH)}
                    y={position.y + props.height2 - Math.floor(i / WIDTH)}
                    color={c}
                />
            ))}
        </group>
    );
});
