import "antd/dist/antd.css";
import myStyles from "./CallList.module.css";
import React, { useEffect, useState } from "react";
import { api } from "../../api/api";
import { Skeleton, Space } from "antd";
import ListItem from "./LIstItem/ListItem";
import DateSelector from "./DateSelector/DateSelector";

const CallList = () => {
  let [data, setData] = useState([]);
  let [dataCount, setDataCount] = useState(0);
  let [dateStart, setDateStart] = useState(
    new Date(new Date().setDate(new Date().getDate() - 3))
  );
  let [dateEnd, setDateEnd] = useState(new Date());
  let [nextPage, setNextPage] = useState(1);
  let [loading, setLoading] = useState(false);
  let [interval, setInterval] = useState("3 дня");
  let [inOut, setInOut] = useState(null);

  let pageSize = 10;

  useEffect(() => {
    loadwithDates();
  }, []);

  // const loadMoreData = () => {
  //   setLoading(true);
  //   api.getData(dateStart, dateEnd, pageSize, nextPage - 1).then((resp) => {
  //     console.log(resp);
  //     setDataCount(resp.total_rows);
  //     setData(resp.results);
  //     setLoading(false);
  //   });
  // };

  const loadwithDates = (dateFrom, dateTo) => {
    setLoading(true);
    api
      .getData(
        dateFrom || dateStart,
        dateTo || dateEnd,
        50,
        nextPage - 1,
        inOut
      )
      .then((resp) => {
        console.log(resp);
        setDataCount(resp.total_rows);
        setData(resp.results);
        setLoading(false);
      });
  };

  const selectDates = (dateFrom, dateTo) => {
    setDateStart(dateFrom);
    setDateEnd(dateTo);
    loadwithDates(dateFrom, dateTo);
  };

  const getDateStart = (dateType, dateTo) => {
    let newDateStart = new Date();
    switch (dateType) {
      case "3 дня":
        return new Date(newDateStart.setDate(dateTo.getDate() - 3));
      case "Неделя":
        return new Date(newDateStart.setDate(dateTo.getDate() - 7));
      case "Месяц":
        return new Date(newDateStart.setMonth(dateTo.getMonth() - 1));
      case "Год":
        return new Date(newDateStart.setFullYear(dateTo.getFullYear() - 1));
      default:
        return newDateStart.setDate(dateTo.getDate());
    }
  };

  const selectDateType = (dateType) => {
    let newDateEnd = dateEnd || new Date();
    let newDateStart = getDateStart(dateType, newDateEnd);
    setDateStart(newDateStart);
    setDateEnd(newDateEnd);
    loadwithDates(newDateStart, newDateEnd);
  };

  const prevPage = () => {
    setDateEnd(new Date().setDate(dateStart.get));
  };

  const rows = data.map((item) => <ListItem key={item.id} {...item} />);

  return (
    <div>
      <div className={myStyles.dateSelector}>
        <DateSelector
          selectDates={selectDates}
          selectDateType={selectDateType}
          nextPage={nextPage}
          prevPage={prevPage}
        />
      </div>
      <div className={myStyles.listWrapper}>
        <div className={myStyles.listHat}>
          <input type="checkbox" />
          <div>Тип</div>
        </div>
        {loading ? (
          <Space>
            <Skeleton.Button active={true} size={"large"} block={true} />
            <Skeleton.Avatar active={true} size={"large"} shape={"circle"} />
            <Skeleton.Input active={true} size={"large"} block={true} />
          </Space>
        ) : (
          rows
        )}
      </div>
    </div>
  );
};

export default CallList;
