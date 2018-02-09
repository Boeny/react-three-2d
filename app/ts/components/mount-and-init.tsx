import * as React from 'react';


interface Props {
    component: JSX.Element;
    onMount?: () => void;
    defaultComponent?: JSX.Element;
}

interface State {
    ready: boolean;
}

export class MountAndInit extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
        this.state = { ready: false };
    }

    componentDidMount() {
        this.props.onMount && this.props.onMount();
        this.setState({ ready: true });
    }

    render() {
        const { component, defaultComponent } = this.props;
        return this.state.ready ? component : (defaultComponent || null);
    }
}
