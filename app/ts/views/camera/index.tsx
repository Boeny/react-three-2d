import * as React from 'react';
import { observer } from 'mobx-react';
import { Vector3 } from 'three';
import { Store } from './store';
import { setCamera } from './actions';


const cameraPosition = new Vector3(0, 0, 5);

export const Camera = observer(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const { zoom } = Store;
    return (
        <orthographicCamera
            ref={setCamera}
            name={'camera'}
            left={- width / 2}
            right={width / 2}
            top={height / 2}
            bottom={- height / 2}
            near={0.1}
            far={1000}
            position={cameraPosition}
            zoom={zoom}
        />
    );
});
/*
<perspectiveCamera
    name={'camera'}
    fov={75}
    aspect={width / height}
    near={0.1}
    far={1000}
    position={cameraPosition}
/>
*/
