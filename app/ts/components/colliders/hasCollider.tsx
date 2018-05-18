import * as React from 'react';
import { setCollider, delCollider } from './utils';


interface Props {
    position: { x: number, y: number };
    getColliderUpdater?: (colliderUpdater: (update: () => void) => void) => void;
}

class Collider extends React.Component<Props> {

    componentDidMount() {
        setCollider(this.props);
        if (this.props.getColliderUpdater === undefined) {
            return;
        }
        this.props.getColliderUpdater(update => () => {
            delCollider(this.props.position);
            update();
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
        <Collider
            position={props.position}
            getColliderUpdater={props.getColliderUpdater}
        >
            <Component {...props} />
        </Collider>
    );
}
