import React from "react";
import Icon from "./Icon";

var Controls = function Controls(_ref) {
  var onPlayPauseClick = _ref.onPlayPauseClick,
      playing = _ref.playing,
      onReselectFile = _ref.onReselectFile,
      processing = _ref.processing,
      onEncode = _ref.onEncode,
      showEncodeBtn = _ref.showEncodeBtn,
      canDownload = _ref.canDownload,
      onDownload = _ref.onDownload,
      frameCurrentX = _ref.frameCurrentX,
      frameCurrentWidth = _ref.frameCurrentWidth,
      frameCurrentPlayedX = _ref.frameCurrentPlayedX;
  return React.createElement("div", {
    className: "rvt-controls-cont"
  }, React.createElement("div", {
    className: "videoSelectedTimeFrameContainer"
  }, React.createElement("div", {
    className: "videoSelectedTimeFrameContainerCurrent",
    style: {
      left: "".concat(frameCurrentX, "%"),
      width: "".concat(frameCurrentWidth, "%")
    }
  }), React.createElement("div", {
    className: "videoSelectedTimeFrameContainerCurrentPlayed",
    style: {
      left: "".concat(frameCurrentPlayedX, "%")
    }
  })), React.createElement("div", {
    className: "px-4 pb-2"
  }, React.createElement("a", {
    className: "rvt-controller-item",
    title: "Pause",
    onClick: onPlayPauseClick
  }, React.createElement(Icon, {
    name: playing ? "pause" : "play"
  })), showEncodeBtn && React.createElement("div", {
    className: "rvt-controller-dropdown rvt-controller-list-wrap"
  }, canDownload ? React.createElement("a", {
    className: "rvt-controller-item",
    onClick: onDownload
  }, React.createElement(Icon, {
    name: "download"
  })) : React.createElement("a", {
    className: "rvt-controller-item",
    onClick: onEncode
  }, React.createElement(Icon, {
    name: processing ? "spin" : "replay"
  })))));
};

export default Controls;