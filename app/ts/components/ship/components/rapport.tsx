import * as React from 'react';
import { WidthRing } from '~/components';


interface Props extends PositionProps {
    radius: number;
}

export function Rapport(props: Props) {
    return (
        <WidthRing
            {...props}
            width={5}
            color={'blue'}
        />
    );
}
