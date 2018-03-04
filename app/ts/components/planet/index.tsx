import * as React from 'react';
import { Mesh } from './mesh';


interface Props {
    radius: number;
}

export function Planet(props: Props) {
    return <Mesh radius={props.radius} />;
}
