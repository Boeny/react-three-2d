import * as React from 'react';
import { observer } from 'mobx-react';
import { Store } from './store';
import { Mesh } from './mesh';


export const Planet = observer(() => (
    <Mesh angle={Store.angle} radius={Store.radius} />
));
