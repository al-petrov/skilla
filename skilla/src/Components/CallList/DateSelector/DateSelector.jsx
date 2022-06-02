import React, { useState } from "react";
import DatePicker from "./DatePicker.jsx";
import myStyles from "./DateSelector.module.css";

const DateSelector = (props) => {
  const [visible, setVisible] = useState(false);

  const [dateInterval, setDateInterval] = useState("3 дня");

  const onClick = ({ key }) => {
    const myDate = new Date();
    myDate.setDate(myDate.getDate() - 3);
    props.dateSelector(myDate);
    console.log("done");
  };

  const showMenu = (e) => {
    setVisible(!visible);
  };

  const hideMenu = () => {
    setVisible(false);
  };

  const selectDates = (dateFrom, DateTo) => {
    props.selectDates(dateFrom, DateTo);
  };

  const selectDateType = (DateType) => {
    props.selectDateType(DateType);
  };

  return (
    <div className={myStyles.dropdown}>
      <div className={myStyles.myDateSelector}>
        <div className={myStyles.selector}>
          <div
            className={myStyles.test}
            onClick={showMenu}
            onBlur={() => {
              props.nextPage();
            }}
          >
            <svg
              width="7"
              height="10"
              viewBox="0 0 7 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M6.175 8.825L2.35833 5L6.175 1.175L5 0L0 5L5 10L6.175 8.825Z" />
            </svg>
          </div>
          {/* <img src={leftArrow} className={myStyles.hilighted}/> */}
          <div
            className={myStyles.test}
            onClick={showMenu}
            onBlur={() => {
              hideMenu();
            }}
          >
            <svg
              width="16"
              height="18"
              viewBox="0 0 16 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M14.4 1.63636H13.6V0H12V1.63636H4V0H2.4V1.63636H1.6C0.72 1.63636 0 2.37273 0 3.27273V16.3636C0 17.2636 0.72 18 1.6 18H14.4C15.28 18 16 17.2636 16 16.3636V3.27273C16 2.37273 15.28 1.63636 14.4 1.63636ZM14.4 16.3636H1.6V5.72727H14.4V16.3636Z" />
            </svg>
          </div>
          <div
            className={myStyles.test}
            tabIndex="0"
            onClick={showMenu}
            // onBlur={hideMenu}
          >
            {dateInterval}
          </div>
          <div
            className={myStyles.test}
            onClick={showMenu}
            onBlur={() => {
              props.prevPage();
            }}
          >
            <svg
              width="7"
              height="10"
              viewBox="0 0 7 10"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M0.589844 8.825L4.40651 5L0.589844 1.175L1.76484 0L6.76484 5L1.76484 10L0.589844 8.825Z" />
            </svg>
          </div>
        </div>
      </div>
      <div
        id="myDropdown"
        className={visible ? myStyles.show : myStyles.dropdownContent}
      >
        <div
          key={"1"}
          className={myStyles.menuItem}
          onClick={() => selectDateType("3 дня")}
        >
          3 дня
        </div>
        <div
          key={"2"}
          className={myStyles.menuItem}
          onClick={() => selectDateType("Неделя")}
        >
          Неделя
        </div>
        <div
          key={"3"}
          className={myStyles.menuItem}
          onClick={() => selectDateType("Месяц")}
        >
          Месяц
        </div>
        <div
          key={"4"}
          className={myStyles.menuItem}
          onClick={() => selectDateType("Год")}
        >
          Год
        </div>
        <div className={myStyles.dateRange}>
          Указать даты
          <DatePicker selectDates={selectDates} />
        </div>
      </div>
    </div>
  );
};

export default DateSelector;
