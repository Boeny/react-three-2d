import * as React from 'react';
import { observer } from 'mobx-react';
import { Store } from './store';
import { WIDTH_SCALE } from'~/constants';


export const Html = observer(() => {
    const { content } = Store;
    if (content === null) {
        return null;
    }
    return (
        <div style={{
            position: 'fixed',
            color: '#ff3939',
            top: '50%',
            left: '50%',
            height: 20,
            marginLeft: (WIDTH_SCALE - content.length * 7.6) / 2,
            marginTop: -48
        }} >
            {content}
        </div>
    );
});
