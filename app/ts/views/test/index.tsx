import * as React from 'react';
import { Store } from '~/views/planet/store';
import { setColor } from '~/views/planet/actions';
import { MountAndInit } from '~/components/mount-and-init';


let element: HTMLDivElement | null = null;

interface Props {
    onMount: (check: () => void) => void;
}

export function Test(props: Props) {
    const { onMount } = props;
    const { style } = Store;
    return (
        <MountAndInit
            component={(
                <div
                    onChange={() => console.log('something changed!')}
                    ref={el => element = el}
                    style={style}
                >mesh</div>
            )}
            onMount={() => onMount(
                () => setColor(element && element.style.backgroundColor || 'white')
            )}
        />
    );
}
