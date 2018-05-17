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
    const { position, state } = props.store;
    return (
        <Particle
            zIndex={1}
            x={position.x}
            y={position.y}
            color={state.color}
        />
    );
});


interface Props extends InitialParams {
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
        if (rest.hasCollider) {
            setCollider(store);
        }
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
        if (store.hasCollider) {
            delCollider(store.position);
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
            store.velocity = this.props.velocity;
        }
    }

    render() {
        const { store } = this.state;
        return (
            store ?
                <Connected store={store} />
            : null
        );
    }
}
