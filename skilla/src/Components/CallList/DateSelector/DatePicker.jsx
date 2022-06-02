import React, { useState } from "react";
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
  return (
    <DatePicker
      selectsRange={true}
      className={myStyle.datePickerInput}
      startDate={startDate}
      endDate={endDate}
      onChange={(update) => {
        setDateRange(update);
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
              sDate[1],
              sDate[0]
            );
            let mEDt = new Date(
              Number(eDate[2]) > new Date().getFullYear() - 2000
                ? "20" + eDate[2]
                : "19" + eDate[2],
              eDate[1],
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
            setDateRange([mStDt, mEDt]);
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
          mask="_"
        />
        // <MaskedTextInput
        //   type="text"
        //   className={myStyle.datePickerInput}
        //   mask={[
        //     /\d/,
        //     /\d/,
        //     ".",
        //     /\d/,
        //     /\d/,
        //     ".",
        //     /\d/,
        //     /\d/,
        //     "-",
        //     /\d/,
        //     /\d/,
        //     ".",
        //     /\d/,
        //     /\d/,
        //     ".",
        //     /\d/,
        //     /\d/,
        //   ]}
        // />
      }
    />
  );
};

export default MyDatePicker;
