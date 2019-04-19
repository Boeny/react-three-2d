import * as React from 'react';
import { observer } from 'mobx-react';
import { Store } from './store';
import { UploadFile } from './upload';


const Component = observer(() => {
    const { content } = Store.state;
    if (!content) {
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
            marginLeft: (1 - 30 * 7.6) / 2 - 10,
            marginTop: -46
        }} >
            {content}
        </div>
    );
});


export class Html extends React.Component {

    componentDidMount() {
        window.removeEventListener('resize', () => Store.setSize());
    }

    render() {
        return (
            <React.Fragment>
                <UploadFile />
                <Component />
            </React.Fragment>
        );
    }
}
