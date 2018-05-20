import * as React from 'react';
import { Vector2 } from 'three';
import { setCollider, delCollider } from './utils';
import { IBodyStore } from './types';


export interface Props {
    position: { x: number, y: number };
    velocity: Vector2;
    store: IBodyStore;
    getColliderUpdater?: (colliderUpdater: (update: (v: Vector2) => void) => () => void) => void;
}

class Collider extends React.Component<Props> {

    componentDidMount() {
        setCollider(this.props);
        if (this.props.getColliderUpdater === undefined) {
            return;
        }
        this.props.getColliderUpdater(update => () => {
            delCollider(this.props.position);
            update(this.props.velocity);
            setCollider(this.props);
        });
    }

    componentWillUnmount() {
        delCollider(this.props.position);
    }

    render() {
        return this.props.children;
    }
}


export function hasCollider<T extends Props>(Component: (props: T) => JSX.Element | null) {
    return (props: T) => (
        <Collider {...props}>
            <Component {...props} />
        </Collider>
    );
}
