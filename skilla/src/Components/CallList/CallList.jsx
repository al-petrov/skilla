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
  });
  const [currentSorting, setCurrentSorting] = useState({
    column: "",
    inc: false,
  });
  const [currentPlaying, setCurrentPlaying] = useState("");
  const [checkVisible, setCheckVisible] = useState(false);

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
  };

  const Divider = (props) => {
    let divText = "";
    if (
      props.newDate ===
      new Date(
        new Date(Date.now() - 86400000).setHours(3, 0, 0, 0)
      ).toLocaleDateString("fr-CA")
    ) {
      divText = "вчера";
    } else {
      divText = props.newDate;
    }
    return (
      <div className={myStyles.daysDivider}>
        <div>{divText}</div>
        <div className={myStyles.callCount}>67</div>
      </div>
    );
  };

  let personsSet = new Set(["1"]);
  let previousDate = null;
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
    if (
      previousDate &&
      !currentSorting.column &&
      item.date_notime !== previousDate
    ) {
      previousDate = item.date_notime;
      return (
        <div>
          <Divider newDate={item.date_notime} />
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
            setCheckVisible={setCheckVisible}
          />
        </div>
      );
    } else {
      previousDate = item.date_notime;
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
          setCheckVisible={setCheckVisible}
        />
      );
    }
  });

  const MyFilters = () => {
    let myFiltersList = [];
    let i = 0;
    for (let value in filters) {
      myFiltersList.push(
        <MyFilter
          key={i++}
          items={filters[value]}
          current={currentFilters[value]}
          type="callTypes"
          changeCurrentFilter={changeCurrentFilter}
        />
      );
    }
    return <div className={myStyles.filters}>{myFiltersList}</div>;
  };

  const changeCurrentFilter = (filter, value) => {
    let newCurrent = { ...currentFilters };
    newCurrent[filter] = value;
    setCurrentFilters(newCurrent);
  };

  const changeCurrentSorting = (column, inc) => {
    setCurrentSorting({ column, inc });
  };

  const myColumns = [
    {
      key: "1",
      title: "Тип",
      column: "in_out",
      active: true,
      action: changeCurrentSorting,
    },
    {
      key: "2",
      title: "Время",
      column: "date",
      active: true,
      action: changeCurrentSorting,
    },
    {
      key: "3",
      title: "Сотрудник",
      column: "person_surname",
      active: true,
      action: changeCurrentSorting,
    },
    { key: "4", title: "", column: "from_site", active: false, action: null },
    { key: "5", title: "", column: "date", active: false, action: null },
    {
      key: "6",
      title: "Звонок",
      column: "contact_name",
      active: true,
      action: changeCurrentSorting,
    },
    {
      key: "7",
      title: "Источник",
      column: "source",
      active: true,
      action: changeCurrentSorting,
    },
    {
      key: "8",
      title: "Оценка",
      column: "date",
      active: false,
      action: null,
    },
    {
      key: "9",
      title: "Длительность",
      column: "time",
      active: true,
      action: changeCurrentSorting,
      extraClassName: "duration",
    },
  ];

  const myListHat = myColumns.map((item) => {
    let col = null;
    col = item.active ? (
      <div
        key={item.key}
        className={item.extraClassName ? myStyles[item.extraClassName] : ""}
      >
        <MyColumn
          title={item.title}
          inc={
            currentSorting.column === item.column
              ? currentSorting.inc
              : undefined
          }
          type={item.column}
          setCurrentSorting={changeCurrentSorting}
        />
      </div>
    ) : (
      <div
        key={item.key}
        className={item.extraClassName ? myStyles[item.extraClassName] : ""}
      >
        {item.title}
      </div>
    );

    return col;
  });

  const MySkeleton = () => {
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
      skeletons.push(<MySkeleton key={i} />);
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
      >
        <div key={"myDateSelector"} className={myStyles.dateSelector}>
          <DateSelector
            dateStart={dateStart}
            dateEnd={dateEnd}
            selectDates={selectDates}
          />
        </div>
        <MyFilters />
        <div
          key={"myListHat"}
          className={myStyles.listHat}
          onMouseEnter={() => setCheckVisible(true)}
          onMouseLeave={() => setCheckVisible(false)}
        >
          {checkVisible ? (
            <input
              type="checkbox"
              className={
                checkVisible ? myStyles.checkVisible : myStyles.checkInvisible
              }
            />
          ) : (
            <div></div>
          )}
          {/* <input
            type="checkbox"
            className={
              checkVisible ? myStyles.checkVisible : myStyles.checkInvisible
            }
          /> */}
          {myListHat}
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
