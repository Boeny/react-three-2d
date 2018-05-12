import * as React from 'react';
import { observer } from 'mobx-react';
import { getStore, InitialParams } from './store';
import { setCollider, delCollider } from '../colliders/utils';
import { IStore } from './types';
import { Particle } from '../particle';
import { Store as movable } from '../movable/store';


interface ConnectedProps {
    store: IStore;
}

const Connected = observer((props: ConnectedProps) => {
    const { position, color } = props.store;
    return (
        <Particle
            zIndex={1}
            x={position.x}
            y={position.y}
            color={color}
        />
    );
});


interface Props extends InitialParams {
    hasCollider?: boolean;
    isMovable?: boolean;
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

    componentDidMount() {
        const { hasCollider, isMovable, getInstance, ...rest } = this.props;
        const store = getStore(rest);
        if (hasCollider) {
            setCollider(store);
        }
        if (isMovable) {
            movable.add(store);
        }
        getInstance && getInstance(store);
        this.setState({ store });
    }

    componentWillUnmount() {
        const { store } = this.state;
        if (store === null) {
            return;
        }
        if (this.props.hasCollider) {
            delCollider(store.position);
        }
        if (this.props.isMovable) {
            movable.del(store);
        }
    }

    render() {
        return (
            this.state.store === null ? null : <Connected store={this.state.store} />
        );
    }
}
