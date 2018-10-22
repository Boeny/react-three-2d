import * as React from 'react';
import { Mesh, Geometry } from 'three';


interface Props {
    components: (Mesh | null)[][];
    withShadows?: boolean;
}

export function Union(props: Props) {
    const { components, withShadows } = props;
    const geometry = new Geometry();
    components.forEach(group => group.forEach(m => {
        if (m) {
            geometry.merge(m.geometry as Geometry, m.matrix);
        }
    }));
    return (
        <mesh
            castShadow={!!withShadows}
            receiveShadow={!!withShadows}
        >
            <geometry
                vertices={geometry.vertices}
                faces={geometry.faces}
                faceVertexUvs={geometry.faceVertexUvs}
            />
            <meshLambertMaterial color={'#ffffff'} />
        </mesh>
    );
}
