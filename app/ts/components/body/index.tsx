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

    delMovable: () => void;

    componentDidMount() {
        const { isMovable, getInstance, ...rest } = this.props;
        const store = getStore(rest);
        getInstance && getInstance(store);
        if (rest.hasCollider) {
            setCollider(store);
        }
        if (isMovable) {
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
        if (this.props.hasCollider) {
            delCollider(store.position);
        }
        if (this.props.isMovable) {
            this.delMovable();
        }
    }

    componentDidUpdate({ color, position, velocity }: Props) {// previous
        if (this.state.store === null) {
            return;
        }
        if (color !== this.props.color) {
            this.state.store.setColor(this.props.color);
        }
        if (position.x !== this.props.position.x || position.y !== this.props.position.y) {
            this.state.store.setPosition(this.props.position);
        }
        if (this.props.velocity === undefined) {// new
            return;
        }
        if (velocity === undefined) {
            this.state.store.velocity = this.props.velocity;
            return;
        }
        if (velocity.x !== this.props.velocity.x || velocity.y !== this.props.velocity.y) {
            this.state.store.velocity = this.props.velocity;
        }
    }

    render() {
        return (
            this.state.store === null ? null : <Connected store={this.state.store} />
        );
    }
}
