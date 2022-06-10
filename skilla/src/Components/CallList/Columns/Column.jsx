import React, { useCallback, useEffect, useRef, useState } from "react";
import myStyles from "./Column.module.css";
import FilterArrow from "./../../Common/FilterArrow";

const MyColumn = (props) => {
  const [hovered, setHovered] = useState(false);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    if (props.inc === undefined) {
      setSelected(false);
    } else {
      setSelected(true);
    }
  }, [props.inc]);

  const setCurrentSorting = (e) => {
    props.setCurrentSorting(props.type, !props.inc);
  };

  return (
    // <div className={myStyles.columnHat} onClick={setCurrentSorting}>
    <div className={myStyles.columnTitle} onClick={setCurrentSorting}>
      <div className={myStyles.columnHat}>{props.title}</div>
      {selected ? <FilterArrow hovered={true} arrowUp={props.inc} /> : null}
    </div>
    // </div>
  );
};

export default MyColumn;
