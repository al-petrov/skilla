import myStyles from "./ListItem.module.css";
import React, { useEffect, useRef, useState } from "react";
import inCallBlue from "../../../icons/inCallBlue.svg";
import inCallRed from "../../../icons/inCallRed.svg";
import outCallGreen from "../../../icons/outCallRed.svg";
import outCallRed from "../../../icons/outCallRed.svg";
import web from "../../../icons/web.svg";
import phone from "../../../icons/phone.svg";
import listButton from "./../../../icons/listButton.svg";
import play from "./../../../icons/play.svg";
import pause from "./../../../icons/pause.svg";
import { api } from "../../../api/api";
import ReactAudioPlayer from "react-audio-player";
import useAudioPlayer from "./useAudioPlayer";

const ListItem = (props) => {
  let [hovered, setHovered] = useState(false);
  let [nowPlaying, setNowPlaying] = useState(false);
  let [loading, setLoading] = useState(false);
  let [playerValues, setPlayerValues] = useState();

  useEffect(() => {
    if (props.playerValues) {
      setPlayerValues(props.playerValues);
      // if (time) {
      //   let minutes = Math.floor(time / 60);
      //   let seconds = Math.floor(time - minutes * 60);
      //   seconds = seconds < 10 ? "0" + seconds : seconds;
      //   durationString = "" + minutes + ":" + seconds;
      // }
      console.log(props.playerValues);
    }
  }, [props.playerValues]);

  const typeCallImage =
    props.in_out === 1
      ? props.status === "Не дозвонился"
        ? inCallRed
        : inCallBlue
      : props.status === "Не дозвонился"
      ? outCallRed
      : outCallGreen;
  const callDate = new Date(props.date);
  const callTime =
    callDate.getHours().toString().padStart(2, "0") +
    ":" +
    callDate.getMinutes().toString().padStart(2, "0");

  // let durationString = "";
  // let time = props.playerValues ? props.playerValues.duration : props.time;
  // if (time) {
  //   let minutes = Math.floor(time / 60);
  //   let seconds = Math.floor(time - minutes * 60);
  //   seconds = seconds < 10 ? "0" + seconds : seconds;
  //   durationString = "" + minutes + ":" + seconds;
  // }

  const getRecord = (record, partnership, id) => {
    setLoading(true);
    api.getRecord(record, partnership).then((resp) => {
      if (resp.status === 200) {
        resp.blob().then((result) => {
          const url = window.URL.createObjectURL(result);
          props.setNewAudio(url, id);
          setNowPlaying(true);
        });
      }
    });
  };

  const playPause = (record, partnership, id) => {
    if (!nowPlaying) {
      getRecord(record, partnership, id);
      console.log(record, partnership, id);
    } else {
      props.pauseAudio();
      setNowPlaying(false);
    }
  };

  const getDurationString = () => {
    let time = props.playerValues ? props.playerValues.curTime : props.time;
    if (time) {
      let minutes = Math.floor(time / 60);
      let seconds = Math.floor(time - minutes * 60);
      seconds = seconds < 10 ? "0" + seconds : seconds;
      return "" + minutes + ":" + seconds;
    }
  };

  return (
    <div className={myStyles.listItem}>
      <input type="checkbox" className={myStyles.itemCheck} />
      <div className={myStyles.border}>
        <img src={typeCallImage} />
        <div className={myStyles.callTime}>{callTime}</div>
        <div className={myStyles.avatar}>
          <img src={props.person_avatar} />
        </div>
        <div className={myStyles.web}>
          {props.from_site ? <img src={web} /> : null}
        </div>
        <img src={phone} />
        <div className={myStyles.nameBlock}>
          <div className={myStyles.name}>
            {props.contact_name ? props.contact_name : props.from_number}
          </div>
          <div className={myStyles.company}>
            {props.contact_company
              ? props.contact_company
              : props.contact_name
              ? props.from_number
              : null}
          </div>
        </div>
        <div className={myStyles.source}>{props.source}</div>
        <img src={listButton} />
        <div className={myStyles.record}>
          {props.time ? (
            <div className={myStyles.player}>
              <div className={myStyles.duration}>{getDurationString()}</div>
              <div className={myStyles.playerButton}>
                <img
                  src={nowPlaying ? pause : play}
                  onClick={() =>
                    playPause(props.record, props.partnership_id, props.id)
                  }
                />
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ListItem;
