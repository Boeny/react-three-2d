import * as React from 'react';
import { observer } from 'mobx-react';
import { Store as movable } from '../../movable/store';
import { getStore } from './store';
import { IStore, InitialParams, BulletType } from './types';
import { Quad } from '../../quad';


interface BulletProps {
    bullet: BulletType;
}

const Bullet = observer(({ bullet }: BulletProps) => {
    return (
        <Quad
            position={bullet.position}
            rotation={bullet.rotation}
            width={0.4}
            height={0.25}
            color={'#aaaaaa'}
        />
    );
});


const BulletsComponent = observer(({ store }: { store: IStore }) => {
    return (
        <group>
            {store.state.data.map((item, i) => (
                <Bullet key={i} bullet={item} />
            ))}
        </group>
    );
});


interface Props extends InitialParams {
    onRef: (store: IStore) => void;
}

export class Bullets extends React.Component<Props> {

    store = getStore();

    componentDidMount() {
        this.store.init(this.props);
        this.props.onRef(this.store);
        movable.add({ onEveryTick: getOnEveryTick(this.store) });
    }

    componentDidUpdate() {
        this.store.init(this.props);
    }

    render() {
        return (
            <BulletsComponent store={this.store} />
        );
    }
}

const getOnEveryTick = (store: IStore) => (deltaTime: number) => {
    // check for explosion in the next frame
    store.removeExploded();
    // change position by velocity
    store.updatePosition(deltaTime);
    // change rotation by rotation velocity
};
