import * as React from 'react';


interface Props extends PositionProps {
    radius: number;
    width: number;
    children?: any;
}

export function SecondDeck(props: Props) {
    return (
        <group position={props.position}>
            {props.children}
        </group>
    );
}
