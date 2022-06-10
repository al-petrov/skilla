import "antd/dist/antd.css";
import "./App.css";
import { Layout } from "antd";
import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import mailOutline from "./icons/mail_outline_24px.png";
import chartTimeline from "./icons/chart-timeline-variant.png";
import calls from "./icons/calls-24px.png";
import contragents from "./icons/contrag.png";
import documents from "./icons/documents-24px.png";
import localLibrary from "./icons/local_library_black_24px.png";
import orders from "./icons/orders-24px.png";
import persons from "./icons/person_outline_black_24px.png";
import reports from "./icons/reports-24px.png";
import settings from "./icons/settings-24px.png";
import myLogo from "./icons/logo.svg";
import newMenu from "./icons/new.png";
import callAnalitics from "./icons/call-analitics.svg";
import search from "./icons/search.png";
import avatar from "./icons/avatars.svg";
import triangle from "./icons/triangle.png";
import CallList from "./Components/CallList/CallList";

const { Header, Content, Sider } = Layout;

const App = () => {
  let [selectedMenuItem, setSelectedMenuItem] = useState(0);

  const handleMenuClick = (e) => {
    setSelectedMenuItem(e);
  };

  const menuItemsData = [
    { key: 1, icon: chartTimeline, title: "Итоги", path: "/resume" },
    { key: 2, icon: orders, title: "Заказы", path: "/orders" },
    { key: 3, icon: mailOutline, title: "Сообщения", path: "/mail" },
    { key: 4, icon: calls, title: "Звонки", path: "/calls" },
    { key: 5, icon: contragents, title: "Контрагенты", path: "/contragents" },
    { key: 6, icon: documents, title: "Документы", path: "/documents" },
    { key: 7, icon: persons, title: "Исполнители", path: "/persons" },
    { key: 8, icon: reports, title: "Отчеты", path: "/reports" },
    {
      key: 9,
      icon: localLibrary,
      title: "База значний",
      path: "/localLibrary",
    },
    { key: 10, icon: settings, title: "Настройки", path: "/settings" },
  ];

  const menuItems = menuItemsData.map((item) => {
    const selected = selectedMenuItem === item.key ? "Selected" : "";

    return (
      <Link key={item.key} to={item.path}>
        <div
          key={item.key}
          className={"menuItem" + selected}
          onClick={() => {
            handleMenuClick(item.key);
          }}
        >
          <img
            src={item.icon}
            alt={item.title}
            style={{ margin: "0px 0px 0px 10px" }}
          />
          <div className={"menuItemText" + selected}>{item.title}</div>
          {selected ? (
            <div className="newMenu">
              <img src={newMenu} alt={"пункт меню"} />
            </div>
          ) : null}
        </div>
      </Link>
    );
  });

  const currentDate = new Date();
  const stringDate =
    currentDate.toLocaleDateString("ru", {
      weekday: "long",
    }) +
    ", " +
    currentDate.toLocaleDateString("ru", {
      day: "numeric",
      month: "short",
    });

  return (
    <Router>
      <Layout className="my-ant-layaut">
        <Sider
          className="my-ant-layaut-sider"
          breakpoint="xl"
          collapsedWidth="0"
          width="240px"
        >
          <div className="logo">
            <img src={myLogo} height="40px" alt="Skilla Logo" />
          </div>
          {menuItems}
        </Sider>
        <Layout>
          <Header className="site-layout-sub-header-background">
            <div className="myHeader">
              <div className="currentDate">{stringDate}</div>
              <img
                className="headerImg"
                src={callAnalitics}
                alt={"аналитика звонков"}
              />
              <img className="searchImg" src={search} alt={"поиск"} />
              <div className="userName">ИП Сидорова Александра Михайловна</div>
              <img
                className="headerTriangle"
                src={triangle}
                alt={"свойства учетной записи"}
              />
              <img className="avatar" src={avatar} alt={"аватар"} />
            </div>
          </Header>
          <Content className="my-ant-layaut-content">
            <Routes>
              <Route path="/calls" element={<CallList />}></Route>
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
