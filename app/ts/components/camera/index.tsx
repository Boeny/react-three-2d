import * as React from 'react';
import { Vector3, Euler } from 'three';
import { observer } from 'mobx-react';
import { Store } from './store';
import { State } from './types';
import { MountAndInit } from '~/components/mount-and-init';


const CameraComponent = observer(() => {
    const { zoom, position, rotation, translation } = Store.state;
    return (
        <perspectiveCamera
            name={'camera'}
            fov={75}
            aspect={window.innerWidth / window.innerHeight}
            near={0.1}
            far={1000}
            position={new Vector3(
                position.x + translation.x,
                position.y + translation.y,
                position.z + translation.z + zoom
            )}
            rotation={new Euler(rotation.x, rotation.y, rotation.z, 'XYZ')}
        />
    );
});


export type Props = State;

export function Camera(props: Props) {
    return (
        <MountAndInit
            component={<CameraComponent />}
            onMount={() => Store.init(props)}
        />
    );
}
