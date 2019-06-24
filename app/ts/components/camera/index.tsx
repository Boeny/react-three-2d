import * as React from 'react';
import { Vector3 } from 'three';
import { observer } from 'mobx-react';
import { cameraStore } from './store';


export const Camera = observer((props: PositionProps) => {
    const { zoom, position } = cameraStore;
    return (
        <perspectiveCamera
            name={'camera'}
            fov={75}
            aspect={window.innerWidth / window.innerHeight}
            near={0.1}
            far={1000}
            position={new Vector3(
                position.x + props.position.x,
                position.y + props.position.y,
                zoom
            )}
        />
    );
});
