import * as React from 'react';
import { Vector3 } from 'three';
import { observer } from 'mobx-react';
import { Store } from './store';


export const Camera = observer((props: PositionProps) => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    const { zoom } = Store.state;
    const position = props.position ? (
        Store.state.position.add(new Vector3(props.position.x, props.position.y, 0))
    ) : Store.state.position;
    return (
        <orthographicCamera
            ref={(el: any) => Store.setCamera(el)}
            name={'camera'}
            left={-width / 2}
            right={width / 2}
            top={height / 2}
            bottom={-height / 2}
            near={0.1}
            far={10}
            zoom={zoom}
            position={position}
        />
    );
});
