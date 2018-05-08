import * as React from 'react';
import { Vector3 } from 'three';
import { observer } from 'mobx-react';
import { Store } from './store';
import { Body } from '../body';


export function Camera(props: PositionProps) {
    return (
        <group>
            <CameraPosition {...props} />
            <CameraComponent {...props} />
        </group>
    );
}

export const CameraComponent = observer((props: PositionProps) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const { zoom, position } = Store.state;
    const pos2 = props.position ? props.position.clone().add(position) : position;
    return (
        <orthographicCamera
            name={'camera'}
            left={-width / 2}
            right={width / 2}
            top={height / 2}
            bottom={-height / 2}
            near={0.1}
            far={10}
            zoom={zoom}
            position={new Vector3(pos2.x, pos2.y, 5)}
        />
    );
});


function CameraPosition(props: PositionProps) {
    return (
        <Body
            getInstance={body => Store.connected = body}
            name={'camera'}
            afterUpdate={v => Store.setPosition(v)}
            color={'yellow'}
            position={props.position}
        />
    );
}
