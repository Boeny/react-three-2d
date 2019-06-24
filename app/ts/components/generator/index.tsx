import * as React from 'react';
import { Vector2 } from 'three';
import { observer } from 'mobx-react';
import { GeneratorStore } from './store';
import { getCollider } from '~/components/colliders/utils';
import { IStore, Signal } from './types';
import { Body } from '~/components/body';


interface ConnectedProps {
    store: IStore;
}

const Connected = observer((props: ConnectedProps) => {
    const { store } = props;
    return (
        <Body
            name={'generator'}
            isMovable={true}
            hasCollider={true}
            onEveryTick={self => {
                const tick = store.isTimerAfterTickStart;
                store.updateTimer();
                if (tick === store.tick) {
                    return;
                }
                store.setTick(tick);
                if (tick === false) {
                    return;
                }
                sendSignalToPosition(self.position.x - 1, self.position.y, { right: true });
                sendSignalToPosition(self.position.x + 1, self.position.y, { left: true });
                sendSignalToPosition(self.position.x, self.position.y - 1, { up: true });
                sendSignalToPosition(self.position.x, self.position.y + 1, { down: true });
            }}
            color={store.tick ? '#ffffff' : '#49b4d0'}
            position={new Vector2(store.position.x, store.position.y)}
        />
    );
});

function sendSignalToPosition(x: number, y: number, signal: Signal) {
    const collider = getCollider(x, y);
    if (collider) {
        collider.signal(signal);
    }
}


interface Props {
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
        const store = new GeneratorStore(period, tickLength, position);
        this.setState({ store });
    }

    componentDidUpdate({ position }: Props) {// previous
        const { store } = this.state;
        if (store === null) {
            return;
        }
        const { x, y } = this.props.position;
        if (position.x !== x || position.y !== y) {
            store.setPosition(x, y);
        }
    }

    render() {
        const { store } = this.state;
        return (
            store ? <Connected store={store} /> : null
        );
    }
}
