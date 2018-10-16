import * as React from 'react';
import { setCollider, delCollider, updateCollider } from './utils';
import { IBodyStore } from './types';


export interface Props {
    position: Position;
    store: IBodyStore;
}

class Collider extends React.Component<Props> {

    componentDidMount() {
        setCollider(this.props.store);
    }

    componentDidUpdate({ position }: Props) {// previous
        if (position.x !== this.props.position.x || position.y !== this.props.position.y) {
            updateCollider(position);// need old position
        }
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
