import * as React from 'react';
import { MountAndInit } from '~/components/mount-and-init';
import { Loading } from './loading';
import { Scene } from './scene';
// import { Html } from './html';


export function App() {
    return (
        <MountAndInit
            defaultComponent={<Loading />}
            component={(
                <div>
                    <Scene />
                </div>
            )}
        />
    );
}
