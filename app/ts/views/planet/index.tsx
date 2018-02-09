import * as React from 'react';
import { observer } from 'mobx-react';
import { Store } from './store';
import { rotateLeft } from './actions';
import { MountAndInit } from '~/components/mount-and-init';
import { Mesh } from './mesh';


interface Props {
    onMount: (rotate: () => void) => void;
}

export const Planet = observer((props: Props) => (
    <MountAndInit
        component={<Mesh angle={Store.angle} />}
        onMount={() => props.onMount(rotateLeft)}
    />
));
