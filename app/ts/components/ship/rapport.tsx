import * as React from 'react';
import { WidthRing } from '../ring';


const rapportWidth = 5;

interface Props extends PositionProps {
    radius: number;
}

export function Rapport(props: Props) {
    return (
        <WidthRing
            {...props}
            width={rapportWidth}
            color={'blue'}
        />
    );
}
