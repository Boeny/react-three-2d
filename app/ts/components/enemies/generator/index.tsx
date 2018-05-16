import * as React from 'react';
import { observer } from 'mobx-react';
import { getStore } from './store';
import { IStore, CommonProps } from './types';
import { Body } from '~/components/body';


interface ConnectedProps extends CommonProps {
    store: IStore;
}

const Connected = observer((props: ConnectedProps) => {
    const { store, position, onEveryTick } = props;
    return (
        <Body
            name={'generator'}
            isMovable={true}
            hasCollider={true}
            onEveryTick={() => {
                const tick = store.timerEqualsTickStart();
                store.setTick(tick);
                store.updateTimer();
                onEveryTick(tick);
            }}
            color={store.state.tick ? '#ffffff' : '#49b4d0'}
            position={position}
        />
    );
});


interface Props extends CommonProps {
    period: number;
    tickLength: number;
}

interface State {
    store: IStore | null;
}

export class Generator extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = { store: null };
    }

    componentDidMount() {
        const { period, tickLength } = this.props;
        const store = getStore(period, tickLength);
        this.setState({ store });
    }

    render() {
        const { position, onEveryTick } = this.props;
        const { store } = this.state;
        return (
            store ?
                <Connected
                    store={store}
                    position={position}
                    onEveryTick={onEveryTick}
                />
            : null
        );
    }
}
