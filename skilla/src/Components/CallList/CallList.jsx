import "antd/dist/antd.css";
import myStyles from "./CallList.module.css";
import React, { useEffect, useState } from "react";
import { api } from "../../api/api";
import { Skeleton, Space } from "antd";
import ListItem from "./LIstItem/ListItem";
import DateSelector from "./DateSelector/DateSelector";
import InfiniteScroll from "react-infinite-scroll-component";
import MyFilter from "./Filters/Filter";
import useSound from "use-sound";
import prodigy from "./../../icons/prodigy.mp3";

const CallList = () => {
  let [data, setData] = useState([]);
  let [dataCount, setDataCount] = useState(0);
  let [dates, setDates] = useState([
    new Date(new Date().setDate(new Date().getDate() - 3)),
    new Date(),
  ]);
  let [nextPage, setNextPage] = useState(4);
  let [loading, setLoading] = useState(false);
  let [currentFilters, setCurrentFilters] = useState({
    callTypes: null,
    persons: null,
    calls: null,
    sources: null,
    marks: null,
    mistakes: null,
  });
  let [sound, setSound] = useState(prodigy);
  let [play, { stop, isPlaying }] = useSound(sound, { volume: 0.2 });

  // let [inOut, setInOut] = useState("1");

  let [dateStart, dateEnd] = dates;

  const pageSize = 20;

  useEffect(() => {
    loadwithDates();
  }, [dates, currentFilters]);

  // useEffect(() => {
  //    play();
  // }, [sound]);

  const setNewAudio = (newFile) => {
    setSound(newFile);
  };

  const pauseAudio = (newFile) => {
    stop();
  };

  const loadMoreData = () => {
    setLoading(true);
    api.getData(dateStart, dateEnd, pageSize, nextPage).then((resp) => {
      console.log(resp);
      setDataCount(resp.total_rows);
      setData([resp.results, ...resp.results]);
      setLoading(false);
    });
  };

  const loadwithDates = (dateFrom, dateTo) => {
    setLoading(true);
    api
      .getData(
        dateFrom || dateStart,
        dateTo || dateEnd,
        50,
        0,
        currentFilters.callTypes
      )
      .then((resp) => {
        console.log(resp);
        setDataCount(resp.total_rows);
        setData(resp.results);
        setLoading(false);
      });
  };

  const selectDates = (newDates) => {
    setDates(newDates);
  };

  const EmpFilterElement = ({ img, name, surname }) => {
    let title = name + (surname ? " " + surname[0] : "");
    return (
      <div className={myStyles.empFilterElement}>
        <img src={img} alt={title + " аватар"} />
        <div className={myStyles.empName}>{title}</div>
      </div>
    );
  };

  const filters = {
    callTypes: [
      { key: "1", value: null, title: "Все типы" },
      { key: "2", value: "1", title: "Входящие" },
      { key: "3", value: "0", title: "Исходящие" },
    ],
    persons: [{ key: "1", value: null, title: "Все сотрудники" }],
    calls: [{ key: "1", value: null, title: "Все звонки" }],
    sources: [{ key: "1", value: null, title: "Все источники" }],
    marks: [{ key: "1", value: null, title: "Все оценки" }],
    mistakes: [{ key: "1", value: null, title: "Все ошибки" }],
  };

  let personsSet = new Set(["1"]);

  const rows = data.map((item) => {
    if (!personsSet.has(item.person_id)) {
      personsSet.add(item.person_id);
      filters.persons.push({
        key: item.person_id,
        title: (
          <EmpFilterElement
            img={item.person_avatar}
            name={item.person_name}
            surname={item.person_surname}
          />
        ),
        id: item.person_id,
      });
    }
    return (
      <ListItem
        key={item.id}
        setNewAudio={setNewAudio}
        pauseAudio={pauseAudio}
        {...item}
      />
    );
  });

  const changeCurrentFilter = (filter, value) => {
    let newCurrent = { ...currentFilters };
    newCurrent[filter] = value;
    setCurrentFilters(newCurrent);
  };

  const skeletons = [];
  for (let i = 0; i < 15; i++) {
    skeletons.push(
      <div key={i} className={myStyles.listHat}>
        <Space>
          <Skeleton.Button active={true} size={"large"} block={true} />
          <Skeleton.Avatar active={true} size={"large"} shape={"circle"} />
          <Skeleton.Input active={true} size={"large"} block={true} />
          <Skeleton.Button active={true} size={"large"} block={true} />
          <Skeleton.Input active={true} size={"large"} block={true} />
        </Space>
      </div>
    );
  }

  return (
    <div>
      <div className={myStyles.dateSelector}>
        <DateSelector
          dateStart={dateStart}
          dateEnd={dateEnd}
          selectDates={selectDates}
        />
      </div>
      <div className={myStyles.filters}>
        <MyFilter
          items={filters.callTypes}
          title={"Тип звонка"}
          current={currentFilters.callTypes}
          type="callTypes"
          changeCurrentFilter={changeCurrentFilter}
        />
        <MyFilter
          items={filters.persons}
          current={currentFilters.persons}
          type="persons"
          changeCurrentFilter={changeCurrentFilter}
        />
        <MyFilter
          items={filters.calls}
          current={currentFilters.calls}
          type="calls"
          changeCurrentFilter={changeCurrentFilter}
        />
        <MyFilter
          items={filters.sources}
          current={currentFilters.sources}
          type="sources"
          changeCurrentFilter={changeCurrentFilter}
        />
        <MyFilter
          items={filters.marks}
          current={currentFilters.marks}
          type="marks"
          changeCurrentFilter={changeCurrentFilter}
        />
      </div>
      {/* <InfiniteScroll
        dataLength={data.length}
        next={loadMoreData}
        hasMore={data.length < dataCount}
        loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
        // loader={<Spin size="large" />}
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        style={{ display: "flex", flexDirection: "column-reverse" }}
        scrollableTarget="scrollableDiv"
        inverse={true}
        // initialScrollY={3}
      > */}
      <div className={myStyles.listWrapper}>
        <div className={myStyles.listHat}>
          <input type="checkbox" />
          <div>Тип</div>
        </div>
        {loading ? skeletons : rows}
      </div>
      {/* </InfiniteScroll> */}
    </div>
  );
};

export default CallList;
