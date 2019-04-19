import * as React from 'react';
import { Font } from 'three';
import { Mesh, MeshProps } from './mesh';



interface Props extends MeshProps {
    text: string;
    font: string;
}

export function Text(props: Props) {
    const { text, font, ...rest } = props;
    return (
        <Mesh {...rest}>
            <textGeometry
                text={text}
                font={new Font(font)}
                size={1}
                height={1}
                curveSegments={1}
                bevelEnabled={false}
            />
        </Mesh>
    );
}
