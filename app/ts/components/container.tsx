import * as React from 'react';
import { Vector2 } from 'three';
// import { observer } from 'mobx-react';
import { Box } from './box';
import { Particle } from './particle';


const WIDTH = 20;

interface Data {
    color: string;
    name?: string;
}

interface Props extends PositionProps {
    data: Data[];
    borderColor?: string;
}

export const Container = ((props: Props) => {
    const { data, borderColor } = props;
    const count = data.length;
    const width = WIDTH > count ? count : WIDTH;
    const height = count > 0 ? Math.floor(count / WIDTH) + 1 : 0;
    const position = props.position || new Vector2();
    return (
        <Box
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
});


interface ContentProps {
    data: Data[];
    position: Vector2;
}

const Content = ((props: ContentProps) => {
    const position = props.position || new Vector2();
    const { data } = props;
    return (
        <group>
            {data.map((item, i) => (
                <Particle
                    key={i}
                    zIndex={1}
                    hasCollider={true}
                    x={position.x + (i % WIDTH)}
                    y={position.y + Math.floor(i / WIDTH)}
                    name={item.name}
                    color={item.color}
                />
            ))}
        </group>
    );
});
