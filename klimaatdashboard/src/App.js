import React, { useState } from "react";
import { Layout, Menu, Row, Col, Card, Rate, theme } from "antd"; // Importeer Ant Design componenten
import TemperatureChart from "./TemperatureChart";
import TemperatuurKaart from "./TemperatuurKaart";
import "./App.css";

import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";

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
              <h1 style={{ textAlign: "center", margin: 0 }}>Dashboard</h1>
            </Col>
          </Row>
        </Header>

        <Content>
          {/* Hoofdinhoud van het dashboard */}
          <Content style={{ padding: "25px 50px" }}>
            <div className="site-layout-content">
              <Row gutter={[16, 16]}>
                {/* Sectie 1: Temperatuur Kaart */}
                <Col xs={24} md={6}>
                  <Card title="Huidige Temperatuur" bordered={false}>
                    <TemperatuurKaart />
                  </Card>
                </Col>

                {/* Sectie 2: Temperatuur Grafiek */}
                <Col xs={24} md={12}>
                  <Card title="Temperatuur Overzicht" bordered={false}>
                    <TemperatureChart />
                  </Card>
                </Col>

                <Col xs={24} md={6}>
                  {" "}
                  <Card
                    title={
                      <div style={{ textAlign: "center" }}>Buienradar</div>
                    }
                    bordered={false}
                  >
                    <div style={{ display: "flex", justifyContent: "center" }}>
                      <iframe
                        title="Buienradar in Akkrum"
                        src="https://gadgets.buienradar.nl/gadget/zoommap/?lat=53.05024&lng=5.83087&overname=2&zoom=11&naam=Akkrum&size=2b&voor=1"
                        scrolling="no"
                        width="330"
                        height="330"
                        frameBorder="no"
                        style={{ border: 0 }} // Optional styling to remove border if necessary
                      ></iframe>
                    </div>
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
              <Row gutter={[16, 16]} style={{ marginTop: "20px" }}>
                <Col xs={24} md={6}>
                  <Card title="Luchtvochtigheid" bordered={false}>
                    {/* Voeg je luchtvochtigheid component hier toe */}
                    <p>Luchtvochtigheid: 70%</p>
                  </Card>
                </Col>
                <Col xs={24} md={12}>
                  <Card title="Wind Snelheid" bordered={false}>
                    {/* Voeg je wind component hier toe */}
                    <p>Wind: 5 m/s</p>
                  </Card>
                </Col>
              </Row>
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
