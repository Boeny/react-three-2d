import * as React from 'react';
import { observer } from 'mobx-react';
import { Box } from './box';


export function Movable(props: PositionProps) {
    return (
        <Box
            isStatic={true}
            hasCollider={true}
            color={'grey'}
            width={20}
            height={10}
            position={props.position}
        >
            <Content {...props} />
        </Box>
    );
}


const Content = observer((props: PositionProps) => {
    props;
    return (
        <group>

        </group>
    );
});
