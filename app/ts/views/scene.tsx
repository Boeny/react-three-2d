import * as React from 'react';
import { Layout } from '~/layout';
import { Planet } from '~/views/planet';


let rotate: () => void = () => null;
let rotating = false;

interface Props {
    onUpdate?: () => void;
}

export function Scene(props: Props) {
    const { onUpdate } = props;
    return (
        <Layout
            onUpdate={() => {
                if (rotating) {
                    rotate();
                }
                onUpdate && onUpdate();
            }}
            onMouseDown={() => {
                rotating = true;
            }}
            onMouseUp={() => {
                rotating = false;
            }}
        >
            <hemisphereLight
                skyColor={0xeeeeff}
                groundColor={0x777788}
                intensity={0.75}
            />
            <directionalLight color={0xffffff} />
            <directionalLight color={0x002288} />
            <ambientLight color={0x222222} />
            <Planet onMount={r => rotate = r}/>
        </Layout>
    );
}
