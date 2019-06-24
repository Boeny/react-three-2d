import * as React from 'react';
import * as constants from '../camera/constants';
import { Vector2 } from 'three';
import { observer } from 'mobx-react';
import { cameraStore } from '../camera/store';
import { eventsStore } from '~/utils/events';
import { State } from './types';
import { Box } from '../box';
import { Body } from '../body';
import { Constants } from '../constants-container';
import { Mode } from './mode';


export function Events(props: PositionProps) {
    const position = props.position || new Vector2();
    return (
        <Box
            color={'#cccccc'}
            width={20}
            position={position}
        >
            <Content position={(new Vector2(1, 1)).add(position)} />
        </Box>
    );
}


const Content = ((props: PositionProps) => {
    const { position } = props;
    return (
        <group>
            {(Object.keys(eventsStore) as (keyof State)[]).map((name, i) => (
                <Mode
                    key={i}
                    position={(new Vector2(i, 7)).add(position)}
                    field={name}
                    state={eventsStore}
                />
            ))}
            <CameraProps
                position={(new Vector2(0, 5)).add(position)}
            />
            <Constants
                position={position}
                data={constants}
            />
        </group>
    );
});


export const CameraProps = observer((props: PositionProps) => {
    return (
        <Body
            hasCollider={true}
            name={<span>zoom = <b>{cameraStore.zoom}</b></span>}
            color={'#6bd6f1'}
            position={props.position}
        />
    );
});
