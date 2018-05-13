import * as React from 'react';
import { Container } from './container';


interface Props extends PositionProps {
    data: { [key: string]: any };
}

export function Constants(props: Props) {
    const { position, data } = props;
    return (
        <Container
            borderColor={'grey'}
            data={Object.keys(data).map(name => {
                const c = (data as any)[name];
                return {
                    name: `${name.split('_').join(' ').toLowerCase()} = ${String(c)}`,
                    state: { color: '#999999' }
                };
            })}
            position={position}
        />
    );
}
