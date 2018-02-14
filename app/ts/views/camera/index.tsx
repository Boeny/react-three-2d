import * as React from 'react';
import { observer } from 'mobx-react';
import { Store } from './store';
import { setCamera } from './actions';


export const Camera = observer(() => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const { zoom, position } = Store;
    return (
        <orthographicCamera
            ref={setCamera}
            name={'camera'}
            left={- width / 2}
            right={width / 2}
            top={height / 2}
            bottom={- height / 2}
            near={0.1}
            far={10}
            zoom={zoom}
            position={position}
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
