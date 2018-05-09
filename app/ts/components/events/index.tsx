import * as React from 'react';
import * as constants from '../camera/constants';
import { Vector2 } from 'three';
import { Store } from './store';
import { Box } from '../box';
import { Container } from '../container';
import { Mode } from './mode';


export function Events(props: PositionProps) {
    const position = props.position || new Vector2();
    return (
        <Box
            isStatic={true}
            hasCollider={true}
            color={'blue'}
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
    return (
        <group>
            <Mode
                title={'mouse click'}
                position={(new Vector2(1, 3)).add(props.position)}
                field={'mouseDragMode'}
                state={Store.state}
            />
            <Mode
                title={'shift key'}
                position={(new Vector2(3, 3)).add(props.position)}
                field={'stepMode'}
                state={Store.state}
            />
            <Container
                borderColor={'grey'}
                data={Object.keys(constants).map(name => ({
                    name: `${name} = ${(constants as { [key: string]: string | number })[name]}`,
                    color: 'grey'
                }))}
                position={props.position}
            />
        </group>
    );
});
