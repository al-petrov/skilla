import "antd/dist/antd.css";
import myStyles from "./CallList.module.css";
import React, { useEffect, useState } from "react";
import { api } from "../../api/api";
import { Skeleton, Space } from "antd";
import ListItem from "./LIstItem/ListItem";
import useAudioPlayer from "./LIstItem/useAudioPlayer";
import DateSelector from "./DateSelector/DateSelector";
import InfiniteScroll from "react-infinite-scroll-component";
import MyFilter from "./Filters/Filter";
import MyColumn from "./Columns/Column";

const CallList = () => {
  const [data, setData] = useState([]);
  const [dataCount, setDataCount] = useState(0);
  const [dates, setDates] = useState([
    new Date(new Date().setDate(new Date().getDate() - 3)),
    new Date(),
  ]);
  const [nextPage, setNextPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [currentFilters, setCurrentFilters] = useState({
    callTypes: null,
    persons: null,
    calls: null,
    sources: null,
    marks: null,
    mistakes: null,
  });
  const [currentSorting, setCurrentSorting] = useState({
    column: "",
    inc: false,
  });
  const [currentPlaying, setCurrentPlaying] = useState("");
  const { curTime, duration, playing, setSource, setPlaying, setClickedTime } =
    useAudioPlayer();

  const [dateStart, dateEnd] = dates;

  const pageSize = 50;

  useEffect(() => {
    loadwithDates();
  }, [dates, currentFilters]);

  useEffect(() => {
    if (currentSorting.column) {
      setData(
        [...data].sort((a, b) => {
          console.log(a, b);
          console.log(a[currentSorting.column], b[currentSorting.column]);
          if (
            currentSorting.inc
              ? a[currentSorting.column] > b[currentSorting.column]
              : a[currentSorting.column] < b[currentSorting.column]
          ) {
            console.log(true);
            return 1;
          } else {
            console.log(false);
            return -1;
          }
        })
      );
    }
  }, [dates, currentSorting]);

  const setNewAudio = (id, blobUrl) => {
    if (id != currentPlaying) {
      setPlaying(false);
      setSource(blobUrl);
      setCurrentPlaying(id);
      setPlaying(true);
    } else {
      setPlaying(true);
    }
    // setSource(blobUrl);
    // setSound(newFile);
  };

  const pauseAudio = () => {
    setPlaying(false);

    // stop();
  };

  const loadMoreData = () => {
    setLoading(true);
    api
      .getData(dateStart, dateEnd, pageSize, nextPage, currentFilters.callTypes)
      .then((resp) => {
        setNextPage(nextPage + 1);
        setCurrentSorting({ ...currentSorting });
        setDataCount(Number(resp.total_rows));
        setData([...data, ...resp.results]);
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
        setDataCount(Number(resp.total_rows));
        setData(resp.results);
        setLoading(false);
        setCurrentSorting({
          column: "",
          inc: false,
        });
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
        id={item.id}
        setNewAudio={setNewAudio}
        pauseAudio={pauseAudio}
        setClickedTime={setClickedTime}
        playerValues={
          currentPlaying === item.id ? { curTime, duration, playing } : null
        }
        nowPlaying={currentPlaying === item.id ? playing : null}
        {...item}
      />
    );
  });

  const changeCurrentFilter = (filter, value) => {
    let newCurrent = { ...currentFilters };
    newCurrent[filter] = value;
    setCurrentFilters(newCurrent);
  };

  const changeCurrentSorting = (column, inc) => {
    setCurrentSorting({ column, inc });
    // setData(
    //   [...data].sort((a, b) => {
    //     console.log(a, b);
    //     console.log(a[column], b[column]);
    //     if (inc ? a[column] > b[column] : a[column] < b[column]) {
    //       console.log(true);
    //       return 1;
    //     } else {
    //       console.log(false);
    //       return -1;
    //     }
    //   })
    // );
  };

  const MySkeleton = ({ id }) => {
    let skeletons = [];
    for (let i = 1; i < 11; i++) {
      skeletons.push(
        <Skeleton
          key={i}
          active
          title={{ width: "90%" }}
          paragraph={{ rows: 0 }}
        />
      );
    }
    return <div className={myStyles.listHat}>{skeletons}</div>;
  };

  const MySkeletonsList = () => {
    let skeletons = [];
    for (let i = 1; i < 11; i++) {
      skeletons.push(<MySkeleton key={i} id={i} />);
    }

    return <div>{skeletons}</div>;
  };

  return (
    <div className={myStyles.infiniteScrollWraper} id="scrollableDiv">
      <audio id="myAudio">
        <source src="" />
      </audio>
      <InfiniteScroll
        dataLength={rows.length}
        next={loadMoreData}
        hasMore={rows.length < dataCount}
        loader={<MySkeleton paragraph={{ rows: 1 }} active />}
        scrollableTarget="scrollableDiv"
        // endMessage={"вот и всё"}
      >
        <div key={"myDateSelector"} className={myStyles.dateSelector}>
          <DateSelector
            dateStart={dateStart}
            dateEnd={dateEnd}
            selectDates={selectDates}
          />
        </div>
        <div key={"myFilters"} className={myStyles.filters}>
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
        <div className={myStyles.listHat}>
          <input type="checkbox" />
          <div>
            <MyColumn
              title={"Тип"}
              inc={
                currentSorting.column === "in_out"
                  ? currentSorting.inc
                  : undefined
              }
              type="in_out"
              setCurrentSorting={changeCurrentSorting}
            />
          </div>
          <div>
            <MyColumn
              title={"Время"}
              inc={
                currentSorting.column === "date"
                  ? currentSorting.inc
                  : undefined
              }
              type="date"
              setCurrentSorting={changeCurrentSorting}
            />
          </div>
          <div>
            <MyColumn
              title={"Сотрудник"}
              inc={
                currentSorting.column === "person_surname"
                  ? currentSorting.inc
                  : undefined
              }
              type="person_surname"
              setCurrentSorting={changeCurrentSorting}
            />
          </div>
          <div></div>
          <div></div>
          <div>
            <MyColumn
              title={"Звонок"}
              inc={
                currentSorting.column === "contact_name"
                  ? currentSorting.inc
                  : undefined
              }
              type="contact_name"
              setCurrentSorting={changeCurrentSorting}
            />
          </div>
          <div>
            <MyColumn
              title={"Источник"}
              inc={
                currentSorting.column === "source"
                  ? currentSorting.inc
                  : undefined
              }
              type="source"
              setCurrentSorting={changeCurrentSorting}
            />
          </div>
          <div>Оценка</div>
          <div className={myStyles.duration}>
            <MyColumn
              title={"Длительность"}
              inc={
                currentSorting.column === "time"
                  ? currentSorting.inc
                  : undefined
              }
              type="time"
              setCurrentSorting={changeCurrentSorting}
            />
          </div>
        </div>
        {rows.length ? rows : <MySkeletonsList />}
        {rows.length < 2 ? (
          <div>
            <div className={myStyles.divider}></div>
            <div className={myStyles.extraItem}></div>
          </div>
        ) : null}
      </InfiniteScroll>
      <div className={myStyles.endingDiv}></div>
    </div>
  );
};

export default CallList;
