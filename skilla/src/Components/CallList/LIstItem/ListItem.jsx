import myStyles from "./ListItem.module.css";
import React, { useState } from "react";
import inCallBlue from "../../../icons/inCallBlue.svg";
import inCallRed from "../../../icons/inCallRed.svg";
import outCallGreen from "../../../icons/outCallRed.svg";
import outCallRed from "../../../icons/outCallRed.svg";
import web from "../../../icons/web.svg";
import phone from "../../../icons/phone.svg";

const ListItem = (props) => {
  let [hovered, setHovered] = useState(false);
  const typeCallImage =
    props.in_out === 1
      ? props.status === "Не дозвонился"
        ? inCallRed
        : inCallBlue
      : props.status === "Не дозвонился"
      ? outCallRed
      : outCallGreen;
  const callDate = new Date(props.date);
  const callTime = callDate.getHours() + ":" + callDate.getMinutes();

  return (
    <div className={myStyles.listItem}>
      {/* <div className={myStyles.itemCheck}> */}
      <input
        type="checkbox"
        className={myStyles.itemCheck}
        // style={{ width: "20px", height: "20px" }}
      />
      {/* </div> */}
      <div className={myStyles.border}>
        {/* <div className={myStyles.callArrow}> */}
        <img src={typeCallImage} />
        {/* </div> */}
        <div className={myStyles.callTime}>{callTime}</div>
        <div className={myStyles.avatar}>
          <img src={props.person_avatar} />
        </div>
        <div className={myStyles.web}>
          {props.from_site ? <img src={web} /> : null}
        </div>
        {/* <div className={myStyles.phone}> */}
        <img src={phone} />
        {/* </div> */}
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
        {/* <div className={myStyles.itemCheck}>{props.id}</div> */}
      </div>
    </div>
  );
};

export default ListItem;
