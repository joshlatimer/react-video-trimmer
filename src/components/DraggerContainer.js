import React, { PureComponent } from "react";

import PropTypes from "prop-types";

export default class DraggerContainer extends PureComponent {
  _screenX = null;
  _screenY = null;
  _ox = null;
  _oy = null;

  _owidth = null;

  handleMouseDown = e => {
    this._screenX = e.screenX;
    this._screenY = e.screenY;
    this._ox = this.props.x;
    this._owidth = this.props.width;

    window.addEventListener("mousemove", this.handleMouseMove, false);
    window.addEventListener("mouseup", this.handleMouseUp, false);
  };

  handleMouseMove = e => {
    this.props.onDrag({
      x: e.screenX - this._screenX + this._ox,
      y: e.screenY - this._screenY + this._oy
    });
  };

  handleMouseUp = () => {
    window.removeEventListener("mousemove", this.handleMouseMove);
    window.removeEventListener("mouseup", this.handleMouseUp);
    const handler = this.props.onDragStop || (() => {});
    handler();
  };

  render() {
    return (
      <div
        className={"rvt-dragger-container " + this.props.className || ""}
        onMouseDown={this.handleMouseDown}
        style={{
          left: this.props.x + "px",
          top: this.props.y + "px",
          width: this.props.width + "px"
        }}
      >
        {this.props.children}
      </div>
    );
  }

  static defaultProps = {
    onDrag() {},
    x: 0,
    y: 0
  };

  static propTypes = {
    x: PropTypes.number,
    y: PropTypes.number,
    onDrag: PropTypes.func,
    className: PropTypes.string,
    children: PropTypes.element
  };
}
