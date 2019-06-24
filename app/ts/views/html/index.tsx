import * as React from 'react';
import { observer } from 'mobx-react';
import { Store } from './store';
import { WIDTH_SCALE } from'~/constants';


export const Html = observer(() => {
    const { content } = Store.state;
    if (!content) {
        return null;
    }
    return (
        <div
            className="loader"
            style={{ marginLeft: (WIDTH_SCALE - 30 * 7.6) / 2 - 10 }}
        >
            {content}
        </div>
    );
});
