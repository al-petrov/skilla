import React, { useEffect, useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import myStyle from "./DatePicker.module.css";
import DatePicker from "react-datepicker";
import NumberFormat from "react-number-format";
import ru from "date-fns/locale/ru";
import { message } from "antd";

const MyDatePicker = (props) => {
  const [dateRange, setDateRange] = useState([
    props.dateFrom || null,
    props.dateTo || null,
  ]);

  const [startDate, endDate] = dateRange;

  useEffect(() => {
    setDateRange([props.dateFrom, props.dateTo]);
  }, [props.dateFrom, props.dateTo]);

  const selectDates = (update) => {
    setDateRange(update);
    if (!(update[1] === null)) {
      props.selectDates(update);
    }
  };

  return (
    <div className={myStyle.datePicker}>
      <DatePicker
        selectsRange={true}
        className={myStyle.datePickerInput}
        startDate={startDate}
        endDate={endDate}
        onChange={(update) => {
          selectDates(update);
        }}
        onKeyDown={(e) => {
          if (e.code === "Enter" || e.code === "NumpadEnter") {
            try {
              let sDate = e.currentTarget.value.split("-")[0].split(".");
              let eDate = e.currentTarget.value.split("-")[1].split(".");
              let mStDt = new Date(
                Number(sDate[2]) > new Date().getFullYear() - 2000
                  ? "19" + sDate[2]
                  : "20" + sDate[2],
                Number(sDate[1]) - 1,
                sDate[0]
              );
              let mEDt = new Date(
                Number(eDate[2]) > new Date().getFullYear() - 2000
                  ? "19" + eDate[2]
                  : "20" + eDate[2],
                Number(eDate[1]) - 1,
                eDate[0]
              );
              if (isNaN(mStDt)) {
                message.error("Указаны некорректное начало периода");
                return;
              }
              if (isNaN(mEDt)) {
                message.error("Указаны некорректный конец периода");
                return;
              }
              selectDates([mStDt, mEDt]);
            } catch {
              message.error("Указаны некорректные даты");
            }
          }
        }}
        dateFormat="dd.MM.yy"
        locale={ru}
        placeholderText="__.__.__-__.__.__"
        customInput={
          <NumberFormat
            format="##.##.##-##.##.##"
            placeholder="MM/YY"
            allowEmptyFormatting
            onClick={() => {
              props.setCalendarOpened(true);
            }}
            mask="_"
          />
        }
      />
      <div className={myStyle.datePickerIcon}>
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
    </div>
  );
};

export default MyDatePicker;
