import React, { useCallback, useRef, useState } from "react";
import myStyles from "./Filter.module.css";
import FilterArrow from "./../../Common/FilterArrow";

const MyFilter = (props) => {
  const [visible, setVisible] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [arrowUp, setArrowUp] = useState(false);

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
    setArrowUp(!arrowUp);
    document.addEventListener("click", onClickCheck);
  };

  const hideMenu = () => {
    document.removeEventListener("click", onClickCheck);
    setArrowUp(false);
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
    <div
      className={hovered ? myStyles.dropdownHovered : myStyles.dropdown}
      onClick={showMenu}
      ref={myDropdown}
      onMouseLeave={() => setHovered(false)}
      onMouseEnter={() => setHovered(true)}
    >
      <div className={myStyles.filterTitle}>
        <div>{findField(props.current, "value", "title")}</div>
        <FilterArrow hovered={hovered} arrowUp={arrowUp} />
      </div>
      <div className={visible ? myStyles.show : myStyles.dropdownContent}>
        {items}
      </div>
    </div>
  );
};

export default MyFilter;
