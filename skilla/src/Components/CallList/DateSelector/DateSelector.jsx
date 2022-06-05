import React, { useCallback, useRef, useState } from "react";
import DatePicker from "./DatePicker.jsx";
import myStyles from "./DateSelector.module.css";
import balance from "./../../../icons/balance.svg";

const DateSelector = (props) => {
  const [visible, setVisible] = useState(props.visible);
  let [dateStart, setDateStart] = useState(props.dateStart);
  let [dateEnd, setDateEnd] = useState(props.dateEnd);
  const [dateInterval, setDateInterval] = useState("3 дня");

  const myDropdown = useRef(null);
  const onClickCheck = useCallback((e) => {
    myDropdown.current.contains(e.target) || hideMenu();
  }, []);

  const getNewSecondDate = (dateType, firstDate, incr) => {
    let newSecondDate;
    switch (dateType) {
      case "3 дня":
        newSecondDate = incr
          ? new Date(firstDate.getTime() + 3 * 24 * 60 * 60 * 1000)
          : new Date(firstDate.getTime() - 3 * 24 * 60 * 60 * 1000);
        break;
      case "Неделя":
        newSecondDate = incr
          ? new Date(firstDate.getTime() + 8 * 24 * 60 * 60 * 1000)
          : new Date(firstDate.getTime() - 8 * 24 * 60 * 60 * 1000);
        break;
      case "Месяц":
        newSecondDate = incr
          ? firstDate.getMonth() === 12
            ? (newSecondDate = new Date(
                firstDate.getFullYear() + 1,
                0,
                firstDate.getDate()
              ))
            : (newSecondDate = new Date(
                new Date(firstDate).setMonth(firstDate.getMonth() + 1)
              ))
          : firstDate.getMonth() === 0
          ? (newSecondDate = new Date(
              firstDate.getFullYear() - 1,
              12,
              firstDate.getDate()
            ))
          : (newSecondDate = new Date(
              new Date(firstDate).setMonth(firstDate.getMonth() - 1)
            ));
        break;
      case "Год":
        newSecondDate = incr
          ? new Date(
              new Date(firstDate).setFullYear(firstDate.getFullYear() + 1)
            )
          : new Date(
              new Date(firstDate).setFullYear(firstDate.getFullYear() - 1)
            );
        break;
      default:
        newSecondDate = new Date(firstDate);
    }
    if (incr) {
      return newSecondDate > new Date() ? new Date() : newSecondDate;
    }
    return newSecondDate;
  };

  const showMenu = (e) => {
    setVisible(!visible);
    document.addEventListener("click", onClickCheck);
  };

  const hideMenu = () => {
    document.removeEventListener("click", onClickCheck);
    setVisible(false);
  };

  const options = {
    year: "2-digit",
    month: "2-digit",
    day: "2-digit",
  };

  const selectDates = ([dateFrom, dateTo]) => {
    setDateStart(dateFrom);
    setDateEnd(dateTo);
    setDateInterval(
      new Date(dateFrom).toLocaleDateString("ru", options) +
        "-" +
        new Date(dateTo).toLocaleDateString("ru", options)
    );
    props.selectDates([dateFrom, dateTo]);
    hideMenu();
  };

  const selectDateType = (dateType) => {
    let newDateEnd = dateEnd || new Date();
    let newDateStart = getNewSecondDate(dateType, newDateEnd, false);

    setDateStart(newDateStart);
    setDateEnd(newDateEnd);
    setDateInterval(dateType);
    props.selectDates([newDateStart, newDateEnd]);
    hideMenu();
  };

  const prevPage = () => {
    let newDateEnd = new Date(dateStart.getTime() - 24 * 60 * 60 * 1000);
    let newDateStart = getNewSecondDate(dateInterval, newDateEnd, false);
    setDateEnd(newDateEnd);
    setDateStart(newDateStart);
    if (
      !(
        dateInterval === "3 дня" ||
        dateInterval === "Неделя" ||
        dateInterval === "Месяц" ||
        dateInterval === "Год"
      )
    ) {
      setDateInterval(
        new Date(newDateStart).toLocaleDateString("ru", options) +
          "-" +
          new Date(newDateEnd).toLocaleDateString("ru", options)
      );
    }
    props.selectDates([newDateStart, newDateEnd]);
  };

  const nextPage = () => {
    let newDateStart = new Date(dateEnd.getTime() + 24 * 60 * 60 * 1000);
    let newDateEnd = new Date();
    if (newDateStart >= new Date()) {
      newDateStart = new Date();
    } else {
      newDateEnd = getNewSecondDate(dateInterval, newDateStart, true);
    }
    setDateEnd(newDateEnd);
    setDateStart(newDateStart);
    if (
      !(
        dateInterval === "3 дня" ||
        dateInterval === "Неделя" ||
        dateInterval === "Месяц" ||
        dateInterval === "Год"
      )
    ) {
      setDateInterval(
        new Date(newDateStart).toLocaleDateString("ru", options) +
          "-" +
          new Date(newDateEnd).toLocaleDateString("ru", options)
      );
    }
    props.selectDates([newDateStart, newDateEnd]);
  };

  return (
    <div className={myStyles.dropdown} ref={myDropdown}>
      <div className={myStyles.myDateSelector}>
        <div className={myStyles.selector}>
          <div className={myStyles.balance}>
            <img src={balance} alt={"баланс"} />
          </div>
          <div
            className={myStyles.test}
            onClick={() => {
              prevPage();
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
          <div className={myStyles.test}>
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
          <div className={myStyles.test} tabIndex="0" onClick={showMenu}>
            {dateInterval}
          </div>
          <div
            className={myStyles.test}
            onClick={() => {
              nextPage();
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
          className={
            dateInterval === "3 дня"
              ? myStyles.menuItemSelected
              : myStyles.menuItem
          }
          onClick={() => selectDateType("3 дня")}
        >
          3 дня
        </div>
        <div
          key={"2"}
          className={
            dateInterval === "Неделя"
              ? myStyles.menuItemSelected
              : myStyles.menuItem
          }
          onClick={() => selectDateType("Неделя")}
        >
          Неделя
        </div>
        <div
          key={"3"}
          className={
            dateInterval === "Месяц"
              ? myStyles.menuItemSelected
              : myStyles.menuItem
          }
          onClick={() => selectDateType("Месяц")}
        >
          Месяц
        </div>
        <div
          key={"4"}
          className={
            dateInterval === "Год"
              ? myStyles.menuItemSelected
              : myStyles.menuItem
          }
          onClick={() => selectDateType("Год")}
        >
          Год
        </div>
        <div className={myStyles.dateRange}>
          Указать даты
          <DatePicker
            selectDates={selectDates}
            dateFrom={dateStart}
            dateTo={dateEnd}
          />
        </div>
      </div>
    </div>
  );
};

export default DateSelector;
