function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

import React from "react";
import FilePicker from "./components/FilePicker";
import Status from "./components/Status";
import Player from "./components/Player";
import Controls from "./components/Controls";
import Trimmer from "./components/Trimmer";
import WebVideo from "./libs/WebVideo";
import webVideoLoader from "./libs/preloadWebVideo";
import Icon from "./components/Icon";
import { noop, arrayBufferToBlob, readBlobURL, download } from "./libs/utils";
import "./style.js";
import PropTypes from "prop-types";

var ReactVideoTrimmer =
/*#__PURE__*/
function (_React$PureComponent) {
  _inherits(ReactVideoTrimmer, _React$PureComponent);

  /**
   * @type {WebVideo}
   */
  function ReactVideoTrimmer(props) {
    var _this2 = this;

    var _this;

    _classCallCheck(this, ReactVideoTrimmer);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(ReactVideoTrimmer).call(this, props));

    _defineProperty(_assertThisInitialized(_this), "webVideo", webVideoLoader({}));

    _defineProperty(_assertThisInitialized(_this), "handleFFMPEGStdout", function (msg) {// console.log(msg);
    });

    _defineProperty(_assertThisInitialized(_this), "handleFFMPEGReady", function () {
      // console.log("FFMPEG is Ready");
      _this.setState({
        ffmpegReady: true
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleFFMPEGFileReceived", function () {// console.log("FFMPEG Received File");
    });

    _defineProperty(_assertThisInitialized(_this), "handleFFMPEGDone", function (result) {
      _this.setState({
        timeRange: {
          start: 0,
          end: _this.state.timeRange.end
        }
      });

      var videoBlob = arrayBufferToBlob(result[0].data);
      setTimeout(function () {
        _this.decodeVideoFile(videoBlob, function () {
          var handler = _this.props.onVideoEncode || noop;
          handler(result);

          _this.setState({
            encoding: false,
            encoded: true,
            encodedVideo: videoBlob
          });
        });
      }, 300);
    });

    _defineProperty(_assertThisInitialized(_this), "defaultState", {
      decoding: false,
      encoding: false,
      encoded: false,
      playVideo: false,
      videoDataURL: "",
      videoFrames: [],
      isDecoding: false,
      timeRange: {
        start: 5,
        end: _this.props.timeLimit || 15
      },
      encodedVideo: null,
      playedSeconds: 0,
      ffmpegReady: false
    });

    _defineProperty(_assertThisInitialized(_this), "state", _this.defaultState);

    _defineProperty(_assertThisInitialized(_this), "updateVideoDataURL", function (dataURL) {
      return _this.setState({
        videoDataURL: dataURL
      });
    });

    _defineProperty(_assertThisInitialized(_this), "updateVideoFrames", function (frames) {
      return _this.setState({
        videoFrames: frames
      });
    });

    _defineProperty(_assertThisInitialized(_this), "updateIsDecoding", function (state) {
      return _this.setState({
        updateIsDecoding: state
      });
    });

    _defineProperty(_assertThisInitialized(_this), "updateVideoDuration", function (duration) {
      return _this.setState({
        updateVideoDuration: duration
      });
    });

    _defineProperty(_assertThisInitialized(_this), "decodeVideoFile", function (file) {
      var doneCB = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : noop;

      _this.setState({
        decoding: true
      });

      var webVideo = _this.webVideo;
      webVideo.videoFile = file;
      webVideo.decode(file).then(function (_ref) {
        var blob = _ref.blob,
            arrayBuffer = _ref.arrayBuffer,
            dataURL = _ref.dataURL;

        _this.updateVideoDataURL(dataURL);

        var timeRangeStart = _this.state.timeRange.start;
        var duration = _this.webVideo.videoData.duration;
        var timeLimit = timeRangeStart + (_this.props.timeLimit || 10);
        var timeRangeEnd = duration > timeLimit ? timeLimit : duration;

        _this.setState({
          timeRange: {
            start: timeRangeStart,
            end: timeRangeEnd
          },
          playedSeconds: (timeRangeEnd - timeRangeStart) / 2 + timeRangeStart
        });

        _this.setState({
          decoding: false
        });

        doneCB();
      })["catch"](function (e) {
        return console.log(e);
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleFileSelected", function (file) {
      _this.decodeVideoFile(file);
    });

    _defineProperty(_assertThisInitialized(_this), "handleVideoTrim", function (time) {
      _this.setState({
        timeRange: time
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handleEncodeVideo", function (timeRange) {
      _this.setState({
        encoding: true,
        videoDataURL: "",
        playVideo: false
      });

      var timeDifference = timeRange.end - timeRange.start; // console.log(timeRange);

      _this.webVideo.trimVideo(timeRange.start, timeDifference);
    });

    _defineProperty(_assertThisInitialized(_this), "handlePlayPauseVideo", function () {
      var playVideo = _this.state.playVideo;

      _this.setState({
        playVideo: !playVideo
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handlePlayerPause", function () {
      // console.log("pause video");
      _this.setState({
        playVideo: false
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handlePlayerPlay", function () {
      _this.setState({
        playVideo: true
      });
    });

    _defineProperty(_assertThisInitialized(_this), "handlePlayerProgress", function (seconds) {
      if (_this.state.playVideo) {
        _this.setState({
          playedSeconds: seconds
        });
      }
    });

    _defineProperty(_assertThisInitialized(_this), "handleReselectFile", function () {
      _this.setState(_objectSpread({}, _this.defaultState, {
        ffmpegReady: true
      }));
    });

    _defineProperty(_assertThisInitialized(_this), "VideoPlayerWithTrimmer", function (_ref2) {
      var showTrimmer = _ref2.showTrimmer;
      var _this$state = _this.state,
          decoding = _this$state.decoding,
          encoding = _this$state.encoding,
          encoded = _this$state.encoded,
          videoDataURL = _this$state.videoDataURL;
      return React.createElement(React.Fragment, null, !decoding && !encoding && videoDataURL && React.createElement(Player, {
        src: _this.state.videoDataURL,
        timeRange: _this.state.timeRange,
        timeLimit: _this.props.timeLimit,
        playVideo: _this.state.playVideo,
        onPlayerPlay: _this.handlePlayerPlay,
        onPlayerPause: _this.handlePlayerPause,
        onPlayerProgress: _this.handlePlayerProgress,
        vidDuration: _this.webVideo.videoData.duration
      }, !decoding && !encoding && videoDataURL && React.createElement(Controls, {
        onDownload: function onDownload() {
          return _this.handleDownloadVideo(_this.state.encodedVideo);
        },
        canDownload: encoded,
        showEncodeBtn: _this.props.showEncodeBtn,
        onReselectFile: _this.handleReselectFile,
        onEncode: function onEncode() {
          return _this.handleEncodeVideo(_this.state.timeRange);
        },
        onPlayPauseClick: _this.handlePlayPauseVideo,
        processing: encoding,
        playing: _this.state.playVideo,
        vidDuration: _this.webVideo.videoData.duration,
        frameCurrentX: _this.state.timeRange.start / _this.webVideo.videoData.duration * 100,
        frameCurrentWidth: (_this.state.timeRange.end - _this.state.timeRange.start) / _this.webVideo.videoData.duration * 100,
        frameCurrentPlayedX: _this.state.playedSeconds / _this.webVideo.videoData.duration * 100
      })), showTrimmer && React.createElement(Trimmer, {
        onPausePlayer: _this.handlePlayerPause,
        showTrimmer: _this.state.videoDataURL,
        duration: _this.webVideo.videoData.duration,
        onTrim: _this.handleVideoTrim,
        timeLimit: _this.props.timeLimit,
        timeRangeLimit: _this.props.timeRange,
        timeRange: _this.state.timeRange,
        currentTime: _this.state.playedSeconds
      }));
    });

    _defineProperty(_assertThisInitialized(_this), "downloadVideo", function () {
      _this.handleDownloadVideo(_this.state.encodedVideo);
    });

    _defineProperty(_assertThisInitialized(_this), "handleDownloadVideo", function (encodedVideo) {
      var blobURL = readBlobURL(encodedVideo);
      var path = _this.props.downloadPath ? _this.props.downloadPath : "trimmed.mp4";
      download(blobURL, path); // "trimmed.mp4");
    });

    _defineProperty(_assertThisInitialized(_this), "VideoPlayerNoTrimmer", function () {
      return React.createElement(_this2.VideoPlayerWithTrimmer, null);
    });

    _this.webVideo.on("processingFile", function () {
      return _this.updateIsDecoding(true);
    });

    _this.webVideo.on("processedFile", function () {
      return _this.updateIsDecoding(false);
    });

    _this.webVideo.on("FFMPEGStdout", _this.handleFFMPEGStdout);

    _this.webVideo.on("FFMPEGReady", _this.handleFFMPEGReady);

    _this.webVideo.on("FFMPEGFileReceived", _this.handleFFMPEGFileReceived);

    _this.webVideo.on("FFMPEGDone", _this.handleFFMPEGDone);

    return _this;
  }

  _createClass(ReactVideoTrimmer, [{
    key: "render",
    value: function render() {
      var _this$state2 = this.state,
          decoding = _this$state2.decoding,
          encoding = _this$state2.encoding,
          encoded = _this$state2.encoded,
          videoDataURL = _this$state2.videoDataURL,
          ffmpegReady = _this$state2.ffmpegReady;
      return React.createElement("div", {
        className: "rvt-main-container"
      }, !ffmpegReady && React.createElement(Status, null, React.createElement(Icon, {
        name: "spin",
        className: "rvt-icon-spin"
      }), this.props.loadingFFMPEGText || "PLEASE WAIT..."), ffmpegReady && encoded && React.createElement(this.VideoPlayerNoTrimmer, null), ffmpegReady && !encoded && React.createElement(React.Fragment, null, !decoding && !encoding && !videoDataURL && React.createElement(FilePicker, {
        onFileSelected: this.handleFileSelected,
        minSize: this.props.minSize,
        maxSize: this.props.maxSize
      }), (decoding || encoding) && React.createElement(Status, null, React.createElement(Icon, {
        name: "spin",
        className: "rvt-icon-spin"
      }), encoding ? "ENCODING VIDEO" : "DECODING VIDEO", "..."), React.createElement(this.VideoPlayerWithTrimmer, {
        showTrimmer: true
      })));
    }
  }]);

  return ReactVideoTrimmer;
}(React.PureComponent);

_defineProperty(ReactVideoTrimmer, "propTypes", {
  onVideoEncode: PropTypes.func,
  showEncodeBtn: PropTypes.bool,
  timeLimit: PropTypes.number,
  loadingFFMPEGText: PropTypes.string,
  downloadPath: PropTypes.string
});

export var preloadWebVideo = webVideoLoader;
export default ReactVideoTrimmer;