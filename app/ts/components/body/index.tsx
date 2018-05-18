import * as React from 'react';
import { observer } from 'mobx-react';
import { Store as movable } from '../movable/store';
import { getStore, InitialParams } from './store';
import { IStore } from './types';
import { Particle, ParticleCollider } from '../particle';


interface ConnectedProps {
    store: IStore;
}

const Connected = observer((props: ConnectedProps) => {
    const { position, state } = props.store;
    return (
        <Particle
            zIndex={1}
            position={position}
            color={state.color}
        />
    );
});


const ConnectedCollider = observer((props: ConnectedProps) => {
    const { position, state } = props.store;
    return (
        <ParticleCollider
            zIndex={1}
            position={position}
            color={state.color}
            getColliderUpdater={updater => {
                props.store.updateCollider = updater(() => store.update());
            }}
        />
    );
});


interface Props extends InitialParams {
    hasCollider?: boolean;
    getInstance?: (body: IStore) => void;
}

interface State {
    store: IStore | null;
}

export class Body extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = { store: null };
    }

    delMovable: () => void = () => undefined;

    componentDidMount() {
        const { getInstance, ...rest } = this.props;
        const store = getStore(rest);
        getInstance && getInstance(store);
        if (rest.isMovable) {
            movable.add(store);
            this.delMovable = () => {
                movable.del(store);
            };
        }
        this.setState({ store });
    }

    componentWillUnmount() {
        const { store } = this.state;
        if (store === null) {
            return;
        }
        if (store.isMovable) {
            this.delMovable();
        }
    }

    componentDidUpdate({ color, position, velocity }: Props) {// previous
        const { store } = this.state;
        if (store === null) {
            return;
        }
        if (color !== this.props.color) {
            store.setColor(this.props.color);
        }
        if (position.x !== this.props.position.x || position.y !== this.props.position.y) {
            store.setPosition(this.props.position);
        }
        if (this.props.velocity === undefined) {// new
            return;
        }
        if (velocity === undefined) {
            store.velocity = this.props.velocity;
            return;
        }
        if (velocity.x !== this.props.velocity.x || velocity.y !== this.props.velocity.y) {
            debugger;
            store.velocity = this.props.velocity;
        }
    }

    render() {
        const { hasCollider } = this.props;
        const { store } = this.state;
        if (store === null) {
            return null;
        }
        return (
            hasCollider ?
                <ConnectedCollider store={store} />
            :
                <Connected store={store} />
        );
    }
}
