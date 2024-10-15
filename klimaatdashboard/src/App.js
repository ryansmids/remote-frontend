import React, { useState } from "react";
import { Layout, Menu, Row, Col, Card, Rate, theme } from "antd"; // Importeer Ant Design componenten
import TemperatureChart from "./TemperatureChart";
import TemperatureChartBinnen from "./TemperatureChartBinnen";
import TemperatuurKaart from "./TemperatuurKaart";

import "./App.css";

import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import BinnenTemperatuurKaart from "./BinnenTemperatuurKaart";

const { Header, Content, Footer, Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const items = [
  getItem("Option 1", "1", <PieChartOutlined />),
  getItem("Option 2", "2", <DesktopOutlined />),
  getItem("User", "sub1", <UserOutlined />, [
    getItem("Tom", "3"),
    getItem("Bill", "4"),
    getItem("Alex", "5"),
  ]),
  getItem("Team", "sub2", <TeamOutlined />, [
    getItem("Team 1", "6"),
    getItem("Team 2", "8"),
  ]),
  getItem("Files", "9", <FileOutlined />),
];

const App = () => {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Layout
      style={{
        minHeight: "100vh",
      }}
    >
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="dark"
          defaultSelectedKeys={["1"]}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            background: colorBgContainer,
            padding: 2,
            borderRadius: borderRadiusLG,
          }}
        >
          <Row justify="center" align="middle">
            <Col xs={24} md={24}>
              <h1 style={{ textAlign: "center", margin: 0 }}>
                Klimaat Dashboard
              </h1>
            </Col>
          </Row>
        </Header>

        <Content>
          {/* Hoofdinhoud van het dashboard */}
          <Content style={{ padding: "25px 50px" }}>
            <div className="site-layout-content">
              <Row gutter={[16, 16]}>


                {/* Sectie 2: Temperatuur Grafiek */}
                <Col xs={24} md={12}>
                  <Card title="Temperatuur Overzicht" bordered={false}>
                    <TemperatureChart />
                  </Card>
                </Col>

                {/* Sectie 2: Temperatuur Grafiek */}
                <Col xs={24} md={12}>
                  <Card title="Temperatuur Overzicht Kantoor" bordered={false}>
                    <TemperatureChartBinnen />
                  </Card>
                </Col>
                {/* Sectie 1: Temperatuur Kaart */}
                <Col xs={24} md={6}>
                  <Card title="Huidige Temperatuur" bordered={false}>
                    <TemperatuurKaart />
                  </Card>
                </Col>

                {/* Binnen Temperatuur. */}
                <Col xs={24} md={6}>
                  <Card title="Huidige Temperatuur" bordered={false}>
                    <BinnenTemperatuurKaart />
                  </Card>
                </Col>



                <Col xs={24} md={6}>
                  <Card title="Tevredenheid" bordered={false}>
                    {/* Voeg je luchtvochtigheid component hier toe */}

                    <Rate allowHalf />
                  </Card>
                </Col>
              </Row>

              {/* Voeg meer secties toe indien nodig */}

            </div>
          </Content>
        </Content>
        <Footer
          style={{
            textAlign: "center",
          }}
        >
          Ant Design ©{new Date().getFullYear()} Created by Ant UED
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
