import React, { PureComponent } from "react";
import Dragger from "./Dragger";
import DraggerContainer from "./DraggerContainer";
import { noop, formatSeconds, leftZero } from "../libs/utils";

const TrimmerOverLay = props => {
  return (
    <div
      className="rvt-trimmer"
      style={{ width: props.width, left: props.left, right: props.right }}
    />
  );
};

const TimeStamp = props => {
  const formated = formatSeconds(props.time);
  return (
    <div className="rvt-player-cursor-current">
      <span className="rvt-player-num">{formated[0]}</span>'
      <span className="rvt-player-num">{formated[1]}</span>
      {!props.noMicroSeconds && (
        <>
          .<span className="rvt-player-num">{leftZero(formated[2], 2)}</span>
        </>
      )}
    </div>
  );
};

class Trimmer extends PureComponent {
  pos2Time = pos => {
    return pos / this.props.widthDurationRatio;
  };

  time2pos = time => {
    return time * this.props.widthDurationRatio;
  };

  keepInRange = x => {
    const containerWidth = this.props.containerWidth;
    if (x < 0) {
      return 0;
    }

    if (x > containerWidth) {
      return containerWidth;
    }

    return x;
  };

  withinTimeLimit = (time, isDragEnd = true) => {
    const timeLimit = this.props.timeLimit;

    let startTime = this.props.startTime;
    let endTime = time;

    if (!isDragEnd) {
      startTime = time;
      endTime = this.props.endTime;
    }

    const duration = this.props.duration;
    let timeTillEnd = duration - endTime;

    const currentRange = duration - startTime - timeTillEnd;
    return timeLimit ? currentRange <= timeLimit : true;
  };

  withinTimeRange = (time, isDragEnd = true) => {
    const timeRange = this.props.timeRangeLimit;
    let interval = time - this.props.startTime;
    if (!isDragEnd) {
      interval = this.props.endTime - time;
    }
    return timeRange ? interval >= timeRange : true;
  };


  //setCurrentTime
  //josh added!
  setCurrentTime = pos => {
    const pos2Time = this.pos2Time(this.keepInRange(pos.x));

    let time = pos2Time;
    console.log("dragStart v5", pos2Time);

    const currentTime = this.props.currentTime;
    const currentTimeIsWithinRange = this.withinTimeRange(time, false);
    const currentTimeIsWithinLimit = this.withinTimeLimit(time, false);

    if (!currentTimeIsWithinRange ||
      !currentTimeIsWithinLimit
    ) {

      console.log("Pausing player");


      time = this.props.startTime;
      const handler = this.props.onPausePlayer || (() => {});
      handler();
    }
    console.log("this.props", this.props);
    this.props.onPlayerProgress(time);
  };


  handleDragStart = pos => {
    const pos2Time = this.pos2Time(this.keepInRange(pos.x));

    console.log("dragStart", pos2Time);
    let time = pos2Time;

    const currentTime = this.props.currentTime;
    const currentTimeIsWithinRange = this.withinTimeRange(time, false);
    const currentTimeIsWithinLimit = this.withinTimeLimit(time, false);

    if (!currentTimeIsWithinRange ||
      !currentTimeIsWithinLimit
    ) {

      console.log("Pausing player");


      time = this.props.startTime;
      const handler = this.props.onPausePlayer || (() => {});
      handler();
    }
    this.props.onStartTimeChange(time);
  };
  handleDragEnd = pos => {
    const pos2Time = this.pos2Time(this.keepInRange(pos.x));
    let time = pos2Time;

    const endTime = this.props.endTime;
    const currentTime = this.props.currentTime;

    const currentTimeIsWithinRange = this.withinTimeRange(time);
    const currentTimeIsWithinLimit = this.withinTimeLimit(time);

    if (!currentTimeIsWithinRange ||
      !currentTimeIsWithinLimit
    ) {
      time = this.props.endTime;
      const handler = this.props.onPausePlayer || (() => {});
      handler();
    }

    this.props.onEndTimeChange(time);
  };
  handleDragStop = () => {
    const handler = this.props.onGetData || noop;
    handler({ start: this.props.startTime, end: this.props.endTime });
  };
  getTrimmerWidth = width => {
    return this.props.containerWidth - width;
  };
  render() {
    const start = this.time2pos(this.props.startTime);
    const end = this.time2pos(this.props.endTime);
    const current = this.time2pos(this.props.currentTime);
    return (
      <React.Fragment>
        <TrimmerOverLay left={0} width={start} />
        <Dragger
          x={start}
          onDrag={this.handleDragStart}
          onDragStop={this.handleDragStop}
        >
          <TimeStamp time={this.props.startTime} />
        </Dragger>



        <Dragger x={current} onDrag={this.setCurrentTime} onDragStop={() => {}}>
          <TimeStamp noMicroSeconds time={this.props.currentTime} />
        </Dragger>

        
        <Dragger
          x={end}
          onDrag={this.handleDragEnd}
          onDragStop={this.handleDragStop}
        >
          <TimeStamp time={this.props.endTime} />
        </Dragger>



        <DraggerContainer
          x={start}
          width={(end - start)}
          onDrag={this.handleDragStart}
          onDragStop={this.handleDragStop}
        >
        </DraggerContainer>



        <TrimmerOverLay right={0} width={this.getTrimmerWidth(end)} />
      </React.Fragment>
    );
  }
}

export class VideoTrimmer extends PureComponent {
  state = {
    start: 0,
    end: 0
  };
  get widthDurationRatio() {
    return this.containerWidth / this.props.duration;
  }
  get containerWidth() {
    return this.containerRef.getBoundingClientRect().width;
  }

  handleStartTimeChange = time => {
    this.setState({ start: time });
  };
  handleGetTrimData = () => {
    const trimmerHandler = this.props.onTrim || noop;
    setTimeout(
      () =>
        trimmerHandler({
          start: this.state.start || this.props.timeRange.start,
          end: this.state.end || this.props.timeRange.end
        }),
      200
    );
  };
  handleEndTimeChange = time => {
    this.setState({ end: time });
  };

  render() {
    return (
      <div className="rvt-trimmer-cont videotrimmer" ref={e => (this.containerRef = e)}>
        {this.props.showTrimmer && (
          <Trimmer
            timeLimit={this.props.timeLimit}
            onStartTimeChange={this.handleStartTimeChange}
            onCurrentTimeChange={this.handleCurrentTimeChange}
            onEndTimeChange={this.handleEndTimeChange}
            widthDurationRatio={this.widthDurationRatio}
            containerWidth={this.containerWidth}
            startTime={this.state.start || this.props.timeRange.start}
            endTime={this.state.end || this.props.timeRange.end}
            currentTime={this.props.currentTime}
            duration={this.props.duration}
            onGetData={this.handleGetTrimData}
            onPausePlayer={this.onPausePlayer}

            onPlayerProgress={this.props.onPlayerProgress}
          />
        )}
      </div>
    );
  }
}

export default VideoTrimmer;
