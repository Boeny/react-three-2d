import * as React from 'react';
import { Vector2 } from 'three';
import { observer } from 'mobx-react';
import { Box } from './box';
import { Particle } from './particle';


const WIDTH = 20;

interface Props extends PositionProps {
    data: { color: string }[];
    borderColor?: string;
}

export function Container(props: Props) {
    const { data, borderColor } = props;
    const count = data.length;
    const width = WIDTH > count ? count : WIDTH;
    const height = count > 0 ? Math.floor(count / WIDTH) + 1 : 0;
    const position = props.position || new Vector2();
    return (
        <Box
            isStatic={true}
            hasCollider={true}
            color={borderColor || 'grey'}
            width={width + 2}
            height={height + 2}
            position={props.position}
        >
            <Content
                data={data}
                position={(new Vector2(1, 1)).add(position)}
            />
        </Box>
    );
}


interface ContentProps {
    data: { color: string }[];
    position: Vector2;
}

const Content = observer((props: ContentProps) => {
    const position = props.position || new Vector2();
    const { data } = props;
    return (
        <group>
            {data.map((item, i) => (
                <Particle
                    key={i}
                    x={position.x + (i % WIDTH)}
                    y={position.y + Math.floor(i / WIDTH)}
                    color={item.color}
                />
            ))}
        </group>
    );
});
