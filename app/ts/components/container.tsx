import * as React from 'react';
import { Vector2 } from 'three';
import { observer } from 'mobx-react';
import { Box2D } from './box-2d';
import { Body } from './body';


const WIDTH = 20;

interface Data {
    name?: string | JSX.Element;
    state: { color: string };
}

interface Props extends PositionProps {
    data: Data[];
    borderColor?: string;
}

export const Container = observer((props: Props) => {
    const { data, borderColor } = props;
    const count = data.length;
    const width = WIDTH > count ? count : WIDTH;
    const height = count > 0 ? Math.floor(count / WIDTH) + 1 : 0;
    const position = props.position || new Vector2();
    return (
        <Box2D
            color={borderColor || 'grey'}
            width={width + 2}
            height={height + 2}
            position={props.position}
        >
            <Content
                data={data}
                position={(new Vector2(1, 1)).add(position)}
            />
        </Box2D>
    );
});


interface ContentProps {
    data: Data[];
    position: Vector2;
}

const Content = observer((props: ContentProps) => {
    const position = props.position || new Vector2();
    const { data } = props;
    if (data.length === 0) {
        return null;
    }
    return (
        <group>
            {data.map((item, i) => (
                <Body
                    key={i}
                    hasCollider={true}
                    position={new Vector2(
                        position.x + (i % WIDTH),
                        position.y + Math.floor(i / WIDTH)
                    )}
                    name={item.name}
                    color={item.state.color}
                />
            ))}
        </group>
    );
});
