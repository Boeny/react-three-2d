import * as React from 'react';
import { observer } from'mobx-react';
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
                return {
                    name: <Item name={name} value={(data as any)[name]} />,
                    state: { color: '#999999' }
                };
            })}
            position={position}
        />
    );
}


interface ItemProps {
    name: string;
    value: any;
}

const Item = observer((props: ItemProps) => {
    const { name, value } = props;
    return (
        <span>
            {name.split('_').join(' ').toLowerCase()} = <b>{String(value)}</b>
        </span>
    );
});
