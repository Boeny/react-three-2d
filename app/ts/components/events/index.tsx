import * as React from 'react';
import * as constants from '../camera/constants';
import { Vector2 } from 'three';
import { observer } from 'mobx-react';
import { Store as camera } from '../camera/store';
import { Store } from './store';
import { IStore } from './types';
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
            {(Object.keys(Store.state) as (keyof IStore['state'])[]).map((name, i) => (
                <Mode
                    key={i}
                    position={(new Vector2(i, 7)).add(position)}
                    field={name}
                    state={Store.state}
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
            name={<span>zoom = <b>{camera.state.zoom}</b></span>}
            color={'#6bd6f1'}
            position={props.position}
        />
    );
});
