import React from "react";
import { Link } from "react-router-dom";

import { Row, Col, Button, Typography, Layout } from "antd";
import "antd/dist/antd.css";

const { Text } = Typography;
const { Content } = Layout;

class Occupied extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <Content style={{ background: "red" }}>
        <Row type="flex" style={{ height: "100px" }}></Row>
        <Row type="flex" style={{ height: "180px" }}></Row>
        <Row type="flex">
          <Col span={4}></Col>
          <Col span={18}>
            <Text type="secondary" style={{ fontSize: "95px", color: "white" }}>
              Sastanak u tijeku!
            </Text>
          </Col>
          <Col span={1}></Col>
          <Col span={1}></Col>
        </Row>
        <Row type="flex" style={{ height: "170px" }}></Row>
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

export default Occupied;