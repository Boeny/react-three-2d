import * as React from 'react';
import * as constants from '../camera/constants';
import { Vector2 } from 'three';
// import { observer } from 'mobx-react';
import { Store as camera } from '../camera/store';
import { Store } from './store';
import { Box } from '../box';
import { Container } from '../container';
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


interface Props {
    position: Vector2;
}

const Content = ((props: Props) => {
    const { position } = props;
    return (
        <group>
            <Mode
                position={(new Vector2(0, 7)).add(position)}
                field={'mouseDragMode'}
                state={Store.state}
            />
            <Mode
                position={(new Vector2(1, 7)).add(position)}
                field={'stepMode'}
                state={Store.state}
            />
            <Container
                borderColor={'#49b4d0'}
                data={[{
                    name: `zoom = ${camera.state.zoom}`,
                    state: { color: '#6bd6f1' }
                }]}
                position={(new Vector2(0, 3)).add(position)}
            />
            <Constants
                position={position}
                data={constants}
            />
        </group>
    );
});


export const CameraProps = ((props: Props) => {
    return (
        <Container
            borderColor={'#6bd6f1'}
            data={[{
                name: `zoom = ${camera.state.zoom}`,
                state: { color: '#6bd6f1' }
            }]}
            position={props.position}
        />
    );
});
