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
import { message } from "antd";
import ReactAudioPlayer from "react-audio-player";
import useAudioPlayer from "./useAudioPlayer";
import PlayerBar from "./PlayerBar";

const ListItem = (props) => {
  let [hovered, setHovered] = useState(false);
  let [thisAudioLoaded, setThisAudioLoaded] = useState(false);
  let [loading, setLoading] = useState(false);
  let [playerValues, setPlayerValues] = useState();

  useEffect(() => {
    if (props.playerValues) {
      setPlayerValues(props.playerValues);
      if (loading) {
        setLoading(false);
        setThisAudioLoaded(true);
        // setNowPlaying(true);
      }
    } else {
      if (loading) {
        setLoading(false);
        setThisAudioLoaded(false);
      }
    }
  }, [props.playerValues, props.nowPlaying]);

  useEffect(() => {
    if (!props.playerValues && !props.nowPlaying) {
      setThisAudioLoaded(false);
      setPlayerValues();
      if (loading) {
        setLoading(false);
      }
    }
  }, [props.nowPlaying]);

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

  const getRecord = (record, partnership, id) => {
    api.getRecord(record, partnership).then((resp) => {
      if (resp.status === 200) {
        resp.blob().then((result) => {
          const url = window.URL.createObjectURL(result);
          props.setNewAudio(id, url);
          // setNowPlaying(true);
        });
      } else {
        message.error("Статус: " + resp.status + ". Запись не найдена.");
      }
    });
  };

  const playPause = (record, partnership, id) => {
    setLoading(true);
    if (!props.nowPlaying) {
      if (thisAudioLoaded) {
        props.setNewAudio(id);
      } else {
        getRecord(record, partnership, id);
      }
    } else {
      props.pauseAudio();
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
              <div className={myStyles.playButton}>
                <button
                  onClick={() =>
                    playPause(props.record, props.partnership_id, props.id)
                  }
                  disabled={loading}
                >
                  <img src={props.nowPlaying ? pause : play} disabled={true} />
                </button>
              </div>
              <PlayerBar
                curTime={playerValues ? playerValues.curTime || 0 : 0}
                id={props.id}
                nowPlaying={props.nowPlaying}
                duration={
                  playerValues
                    ? playerValues.duration || props.time
                    : props.time
                }
                onTimeUpdate={(newCurTime) => props.setClickedTime(newCurTime)}
              />
              <svg
                width="22"
                // height="16"
                viewBox="0 0 13 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M0 16H13V14.1176H0V16ZM13 5.64706H9.28571V0H3.71429V5.64706H0L6.5 12.2353L13 5.64706Z" />
              </svg>
              <svg
                width="24"
                // height="14"
                viewBox="0 0 14 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z" />
              </svg>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ListItem;
