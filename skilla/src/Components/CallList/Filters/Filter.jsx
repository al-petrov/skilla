import React, { useCallback, useEffect, useRef, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import myStyles from "./Filter.module.css";

const MyFilter = (props) => {
  const [visible, setVisible] = useState(false);

  const myDropdown = useRef(null);
  const onClickCheck = useCallback((e) => {
    myDropdown.current.contains(e.target) || hideMenu();
  }, []);

  const findField = (id, searchField, field) => {
    const newFilter = props.items.find((element) => {
      return element[searchField] === id ? true : false;
    });
    if (newFilter) {
      return newFilter[field];
    }
    return undefined;
  };

  const selectFilterValue = (itemId) => {
    let newCurrentValue = findField(itemId, "key", "value");
    if (!(newCurrentValue === undefined)) {
      props.changeCurrentFilter(props.type, newCurrentValue);
    }
  };

  const showMenu = (e) => {
    setVisible(!visible);
    document.addEventListener("click", onClickCheck);
  };

  const hideMenu = () => {
    document.removeEventListener("click", onClickCheck);
    setVisible(false);
  };
  const items = props.items.map((item) => {
    return (
      <div
        key={item.key}
        id={item.key}
        className={
          item.value === props.current
            ? myStyles.menuItemSelected
            : myStyles.menuItem
        }
        onClick={(item) => selectFilterValue(item.target.id)}
      >
        {item.title}
      </div>
    );
  });

  return (
    <div className={myStyles.dropdown} onClick={showMenu} ref={myDropdown}>
      <div>{findField(props.current, "value", "title")}</div>
      <div
        id="myDropdown"
        className={visible ? myStyles.show : myStyles.dropdownContent}
      >
        {items}
      </div>
    </div>
  );
};

export default MyFilter;
