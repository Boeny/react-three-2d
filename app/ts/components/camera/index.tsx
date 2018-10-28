import * as React from 'react';
import { Vector3, Euler, Camera as CameraType } from 'three';
import { observer } from 'mobx-react';
import { Store as html } from '~/views/html/store';
import { Store } from './store';
import { State } from './types';
import { MountAndInit } from '~/components/mount-and-init';


const CameraComponent = observer(() => {
    const { zoom, position, rotation, translation } = Store.state;
    const { windowWidth, windowHeight } = html.state;
    return (
        <perspectiveCamera
            ref={(el: CameraType) => Store.setInstance(el)}
            name={'camera'}
            fov={75}
            aspect={windowWidth / windowHeight}
            near={0.1}
            far={1000}
            position={new Vector3(
                position.x + translation.x,
                position.y + translation.y,
                position.z + translation.z + zoom
            )}
            rotation={new Euler(rotation.x, rotation.y, rotation.z)}
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
