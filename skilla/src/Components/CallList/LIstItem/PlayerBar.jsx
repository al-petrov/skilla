import React, { useState } from "react";
import myStyles from "./PlayerBar.module.css";

export const getDurationString = (time) => {
  if (time) {
    let minutes = Math.floor(time / 60);
    let seconds = Math.floor(time - minutes * 60);
    seconds = seconds < 10 ? "0" + seconds : seconds;
    return "" + minutes + ":" + seconds;
  }
};

const PlayerBar = (props) => {
  const [currentBarHoverTime, setCurrentBarHoverTime] = useState();

  const curPercentage = (props.curTime / props.duration) * 100;

  const calcClickedTime = (e) => {
    const clickPositionInPage = e.pageX;
    const bar = document.getElementById("progressBar" + props.id);
    const barStart = bar.getBoundingClientRect().left + window.scrollX;
    const barWidth = bar.offsetWidth;
    const clickPositionInBar =
      clickPositionInPage > barStart ? clickPositionInPage - barStart : 0;
    const timePerPixel = props.duration / barWidth;
    return {
      time: timePerPixel * clickPositionInBar,
      pixel: clickPositionInBar,
    };
  };

  const handleTimeDrag = (e) => {
    props.onTimeUpdate(calcClickedTime(e).time);

    const updateTimeOnMove = (eMove) => {
      props.onTimeUpdate(calcClickedTime(eMove).time);
    };

    document.addEventListener("mousemove", updateTimeOnMove);

    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", updateTimeOnMove);
    });
  };

  const barOnMouseEnter = () => {
    const updateTimeOnMove = (e) => {
      setCurrentBarHoverTime(calcClickedTime(e));
    };
    const bar = document.getElementById("progressBar" + props.id);
    bar.addEventListener("mousemove", updateTimeOnMove);
  };

  const barOnMouseLeave = () => {
    const bar = document.getElementById("progressBar" + props.id);
    bar.removeEventListener("mousemove", () => {});
    setCurrentBarHoverTime(null);
  };

  return (
    <div className={myStyles.bar}>
      <div
        className={myStyles.barProgress}
        id={"progressBar" + props.id}
        style={{
          background: `linear-gradient(to right, #005ff8 ${curPercentage}%, #ADBFDF 0)`,
        }}
        onMouseDown={props.nowPlaying ? (e) => handleTimeDrag(e) : null}
        onMouseEnter={(e) => barOnMouseEnter(e)}
        onMouseLeave={(e) => barOnMouseLeave(e)}
      >
        {currentBarHoverTime ? (
          <div
            className={myStyles.barTime}
            style={{ left: currentBarHoverTime.pixel }}
          >
            {getDurationString(currentBarHoverTime.time)}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PlayerBar;
