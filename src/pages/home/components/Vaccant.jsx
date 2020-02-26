import React from "react";
import { Link } from "react-router-dom";

import { Row, Col, Button, Layout, Typography } from "antd";
import "antd/dist/antd.css";

const { Content } = Layout;
const { Title } = Typography;

class Vaccant extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Content style={{ background: "green" }}>
        <Row type="flex" style={{ height: "80px" }}></Row>
        <Row type="flex" style={{ height: "180px" }}></Row>
        <Row type="flex">
          <Col span={7}></Col>
          <Col span={6}>
            <Title
              type="secondary"
              style={{ fontSize: "120px", color: "white" }}
            >
              Slobodno
            </Title>
          </Col>
          <Col span={5}></Col>
          <Col span={5}></Col>
        </Row>
        <Row type="flex" style={{ height: "125px" }}></Row>
        <Row type="flex" style={{ height: "8px" }}>
          <Col span={7}></Col>
          <Col span={7}></Col>
          <Col span={6}></Col>
          <Col span={4}>
            <Button>
              <Link to="/scheduler">Dodaj sastanak</Link>
            </Button>
          </Col>
        </Row>
      </Content>
    );
  }
}

export default Vaccant;
