import * as React from 'react';
import { observer } from 'mobx-react';
import { Store as movable } from '../movable/store';
import { BodyStore } from './store';
import { IStore, InitialParams } from './types';
import { Particle, ParticleCollider } from '../particle';


interface ConnectedProps {
    store: IStore;
}

const Connected = observer((props: ConnectedProps) => {
    const { position, color } = props.store;
    // hack to observe this
    position.x;
    position.y;
    return (
        <Particle
            zIndex={1}
            position={position}
            color={color}
        />
    );
});


const ConnectedCollider = observer((props: ConnectedProps) => {
    const { store } = props;
    const { position, color } = store;
    return (
        <ParticleCollider
            zIndex={1}
            store={store}
            position={{ x: position.x, y: position.y }}// to update collider coo
            color={color}
        />
    );
});


interface Props extends InitialParams {
    hasCollider?: boolean;
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
        const store = new BodyStore(
            this.props.isMovable,
            this.props.onCollide,
            this.props.onUnCollide,
            this.props.onEveryTick,
            this.props.onPositionChange,
            this.props.onVelocityChange
        );
        store.setName(this.props.name);
        store.setColor(this.props.color);
        store.setPosition(this.props.position);
        if (this.props.velocity) {
            store.setVelocity(this.props.velocity.x, 'x');
            store.setVelocity(this.props.velocity.y, 'y');
        }
        if (this.props.isMovable) {
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

    componentDidUpdate({ color, position, velocity, name }: Props) {// previous
        const { store } = this.state;
        if (store === null) {
            return;
        }
        if (color !== this.props.color) {
            store.setColor(this.props.color);
        }
        if (name !== this.props.name) {
            store.setName(this.props.name);
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
