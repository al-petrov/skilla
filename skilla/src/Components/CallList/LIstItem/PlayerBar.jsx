import React from "react";
import myStyles from "./PlayerBar.module.css";

const PlayerBar = (props) => {
  const curPercentage = (props.curTime / props.duration) * 100;

  function calcClickedTime(e) {
    const clickPositionInPage = e.pageX;
    const bar = document.getElementById("progressBar" + props.id);
    const barStart = bar.getBoundingClientRect().left + window.scrollX;
    const barWidth = bar.offsetWidth;
    const clickPositionInBar = clickPositionInPage - barStart;
    const timePerPixel = props.duration / barWidth;
    return timePerPixel * clickPositionInBar;
  }

  function handleTimeDrag(e) {
    props.onTimeUpdate(calcClickedTime(e));

    const updateTimeOnMove = (eMove) => {
      props.onTimeUpdate(calcClickedTime(eMove));
    };

    document.addEventListener("mousemove", updateTimeOnMove);

    document.addEventListener("mouseup", () => {
      document.removeEventListener("mousemove", updateTimeOnMove);
    });
  }

  return (
    <div className={myStyles.bar}>
      <div
        className={myStyles.barProgress}
        id={"progressBar" + props.id}
        style={{
          background: `linear-gradient(to right, #005ff8 ${curPercentage}%, #ADBFDF 0)`,
        }}
        onMouseDown={props.nowPlaying ? (e) => handleTimeDrag(e) : null}
      ></div>
    </div>
  );
};

export default PlayerBar;
