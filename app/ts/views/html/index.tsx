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
            color: '#454545',
            background: '#ffffff',
            border: '1px solid #454545',
            top: '50%',
            left: '50%',
            padding: '3px 10px',
            marginLeft: (WIDTH_SCALE - content.length * 7.6) / 2 - 10,
            marginTop: -46
        }} >
            {content}
        </div>
    );
});
