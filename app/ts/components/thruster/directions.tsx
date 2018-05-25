import * as React from 'react';
import { Vector2 } from 'three';
import { observer } from 'mobx-react';
import { Moving } from './types';
import { Particle } from '../particle';


interface Props extends PositionProps {
    moving: Moving;
}

export const Directions = observer((props: Props) => {
    const { moving, position } = props;
    return (
        <group>
            {moving.up ?
                <Particle
                    key={1}
                    position={new Vector2(0.25, 0.75).add(position)}
                    color={'#ff0000'}
                    zIndex={2}
                    width={0.5}
                    height={0.25}
                    borderWidth={0}
                />
                : null}
            {moving.down ?
                <Particle
                    key={2}
                    position={new Vector2(0.25, 0).add(position)}
                    color={'#00ff00'}
                    zIndex={2}
                    width={0.5}
                    height={0.25}
                    borderWidth={0}
                />
                : null}
            {moving.left ?
                <Particle
                    key={3}
                    position={new Vector2(0, 0.25).add(position)}
                    color={'#0000ff'}
                    zIndex={2}
                    width={0.25}
                    height={0.5}
                    borderWidth={0}
                />
                : null}
            {moving.right ?
                <Particle
                    key={4}
                    position={new Vector2(0.75, 0.25).add(position)}
                    color={'#00ffff'}
                    zIndex={2}
                    width={0.25}
                    height={0.5}
                    borderWidth={0}
                />
                : null}
        </group>
    );
});
