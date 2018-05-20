import * as React from 'react';
import { Vector2 } from 'three';
import { observer } from 'mobx-react';
import { getStore } from './store';
import { IStore, CommonProps } from './types';
import { Body } from '~/components/body';


interface ConnectedProps extends CommonProps {
    store: IStore;
}

const Connected = observer((props: ConnectedProps) => {
    const { store, onEveryTick } = props;
    return (
        <Body
            name={'generator'}
            isMovable={true}
            hasCollider={true}
            onEveryTick={() => {
                const tick = store.timerAfterTickStart();
                store.updateTimer();
                if (tick !== store.state.tick) {
                    store.setTick(tick);
                    onEveryTick(tick);
                }
            }}
            color={store.state.tick ? '#ffffff' : '#49b4d0'}
            position={new Vector2(store.position.x, store.position.y)}
        />
    );
});


interface Props extends CommonProps {
    position: Vector2;
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
        const { period, tickLength, position } = this.props;
        const store = getStore(period, tickLength, position);
        this.setState({ store });
    }

    componentDidUpdate({ position }: Props) {// previous
        const { store } = this.state;
        if (store === null) {
            return;
        }
        if (position.x !== this.props.position.x || position.y !== this.props.position.y) {
            store.setPosition(this.props.position);
        }
    }

    render() {
        const { onEveryTick } = this.props;
        const { store } = this.state;
        return (
            store ?
                <Connected
                    store={store}
                    onEveryTick={onEveryTick}
                />
            : null
        );
    }
}
