import * as React from 'react';
import { Mesh, Geometry, Texture, Group } from 'three';
import { getMaterialParams } from '~/utils';


interface Props {
    components: JSX.Element[];
    color?: string;
    texture?: Texture;
}

interface State {
    geometry: Geometry | null;
}

export class Union extends React.Component<Props, State> {

    state: State = { geometry: null };
    group: Group | null = null;

    componentDidMount() {
        if (this.group === null) {
            return;
        }
        this.setState({ geometry: getGeometryFromMeshes(getMeshes(this.group)) });
    }

    setGroup = (group: Group | null) => {
        this.group = group;
    }

    render() {
        const { color, texture, components } = this.props;
        const { geometry } = this.state;
        console.log(geometry);
        return (
            geometry ?
                <mesh>
                    <geometry
                        vertices={geometry.vertices}
                        faces={geometry.faces}
                        faceVertexUvs={geometry.faceVertexUvs}
                    />
                    <meshLambertMaterial {...getMaterialParams(color, texture)} />
                </mesh>
            :
                <group ref={this.setGroup}>
                    {components}
                </group>
        );
    }
}

function getMeshes(group: Group): Mesh[] {
    let meshes: Mesh[] = [];
    group.children.forEach(o => {
        if (o.type === 'Mesh') {
            meshes.push(o as Mesh);
        } else if (o.type === 'Group') {
            meshes = meshes.concat(getMeshes(o));
        }
    });
    return meshes;
}

export function getGeometryFromGroup(group: Group): Geometry {
    const geometry = new Geometry();
    group.children.forEach(o => {
        if (o.type === 'Mesh') {
            geometry.merge((o as Mesh).geometry as Geometry, o.matrix);
        } else if (o.type === 'Group') {
            geometry.merge(getGeometryFromGroup(o), o.matrix);
        }
    });
    return geometry;
}

function getGeometryFromMeshes(meshes: Mesh[]): Geometry {
    const geometry = new Geometry();
    meshes.forEach(o => {
        geometry.merge(o.geometry as Geometry, o.matrix);
    });
    return geometry;
}
