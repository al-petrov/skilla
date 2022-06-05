import myStyles from "./ListItem.module.css";
import React, { useRef, useState } from "react";
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

const ListItem = (props) => {
  let [hovered, setHovered] = useState(false);
  let [playing, setPlaying] = useState(false);
  let [loading, setLoading] = useState(false);
  let [audioSource, setAudioSource] = useState("");

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

  let durationString = "";
  if (props.time) {
    let minutes = Math.floor(props.time / 60);
    let seconds = props.time - minutes * 60;
    seconds = seconds < 10 ? "0" + seconds : seconds;
    durationString = "" + minutes + ":" + seconds;
  }

  const getRecord = (record, partnership) => {
    setLoading(true);
    api.getRecord(record, partnership).then((resp) => {
      if (resp.status === 200) {
        let reader = resp.body.getReader();
        reader.read().then((result) => {
          let blob = new Blob([result.value], { type: "audio/mp3" });

          const url = window.URL.createObjectURL(blob);
          setAudioSource(url);
          //props.setNewAudio(blob);
          // window.audio = new Audio();
          // window.audio.src = url;
          // window.audio.play();
          //props.setNewAudio(result);
        });
        props.setNewAudio(resp.body);
      }
    });
  };

  const playPause = (record, partnership) => {
    if (!playing) {
      getRecord(record, partnership);
      // setPlaying(!playing);

      console.log(record, partnership);
    } else {
      props.pauseAudio();
    }
    setPlaying(!playing);
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
          {durationString ? (
            <div className={myStyles.player}>
              {durationString}
              <div
                className={myStyles.playButton}
                onClick={() => {
                  playPause(props.record, props.partnership_id);
                }}
              >
                <img src={playing ? pause : play} />
              </div>
              <ReactAudioPlayer
                src={audioSource}
                className={myStyles.audioPlayer}
                autoPlay
                controls
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ListItem;
