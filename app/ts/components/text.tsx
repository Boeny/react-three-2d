import * as React from 'react';
import { Vector3, Vector2, Font } from 'three';


interface Props {
    position: Vector2;
    text: string;
    font: string;
}

export function Text(props: Props) {
    const { position, text, font } = props;
    return (
        <mesh position={new Vector3(position.x, position.y, 0)}>
            <textGeometry
                text={text}
                font={new Font(font)}
                size={1}
                height={1}
                curveSegments={1}
                bevelEnabled={false}
            />
        </mesh>
    );
}
