import * as React from 'react';
import { left } from '~/actions';
import { MountAndInit } from '~/components/mount-and-init';
import { Mesh } from './mesh';


interface Props {
    onMount: (rotate: () => void) => void;
}

export const Planet = observer((props: Props) => {
    return (
        <MountAndInit
            component={<Mesh rotation={this.state.rotation} />}
            onMount= {() => props.onMount(left)}
        />
    );
});
