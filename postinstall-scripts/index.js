const fix = require('./content-fixer').default;

fix(
    __dirname + '/../node_modules/react-three-renderer/lib/React3.js',
    "return _react2.default.createElement('canvas', {",
    "return _react2.default.createElement('canvas', {onKeyDown: this.props.onKeyDown,onKeyUp: this.props.onKeyUp,onMouseDown: this.props.onMouseDown,onMouseUp: this.props.onMouseUp,onClick: this.props.onClick,onWheel: this.props.onWheel,onMouseMove: this.props.onMouseMove,"
);

fix(
    __dirname + '/../node_modules/react-three-renderer/lib/React3.js',
    '_react2.default.Component), _class.propTypes = {',
    '_react2.default.Component), _class.propTypes = {onKeyDown: _propTypes2.default.func,onKeyUp: _propTypes2.default.func,onMouseDown: _propTypes2.default.func,onMouseUp: _propTypes2.default.func,onClick: _propTypes2.default.func,onWheel: _propTypes2.default.func,onMouseMove: _propTypes2.default.func,'
);
