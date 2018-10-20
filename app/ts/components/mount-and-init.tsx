import * as React from 'react';


interface Props {
    component: JSX.Element;
    defaultComponent?: JSX.Element;
    onMount?: () => void;
    onUnmount?: () => void;
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

    componentWillUnmount() {
        this.props.onUnmount && this.props.onUnmount();
    }

    render() {
        const { component, defaultComponent } = this.props;
        return this.state.ready ? component : (defaultComponent || null);
    }
}
