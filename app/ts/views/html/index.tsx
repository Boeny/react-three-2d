import * as React from 'react';
import { observer } from 'mobx-react';
import { Store } from './store';
import { WIDTH_SCALE } from'~/constants';


export const Html = observer(() => {
    const { content, position } = Store;
    if (content === null) {
        return null;
    }
    return (
        <div
            style={{
                position: 'fixed',
                color: '#fff',
                top: '50%',
                left: '50%',
                height: 20,
                marginLeft: (WIDTH_SCALE - content.length * 7.6) / 2 + position.x,
                marginTop: - position.y - 30
            }}
        >
            {content}
        </div>
    );
});
