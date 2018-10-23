import * as React from 'react';
import { Mesh, Geometry, Texture } from 'three';
import { getMaterialParams } from '~/utils';


interface Props {
    components: (Mesh | null)[][];
    color?: string;
    texture?: Texture;
}

export function Union(props: Props) {
    const { components, color, texture } = props;
    const geometry = new Geometry();
    components.forEach(group => group.forEach(m => {
        if (m) {
            geometry.merge(m.geometry as Geometry, m.matrix);
        }
    }));
    const matParams = getMaterialParams(color, texture);
    return (
        <mesh>
            <geometry
                vertices={geometry.vertices}
                faces={geometry.faces}
                faceVertexUvs={geometry.faceVertexUvs}
            />
            <meshLambertMaterial {...matParams} />
        </mesh>
    );
}
