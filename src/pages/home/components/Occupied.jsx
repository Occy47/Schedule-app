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
    const { title, start, end } = this.props;
    return (
      <Content style={{ background: "red" }}>
        <Row type="flex" style={{ height: "180px" }}></Row>
        <Row type="flex">
          <Col span={5}></Col>
          <Col span={14} style={{ textAlign: "center" }}>
            <Text
              type="secondary"
              style={{ fontSize: "120px", color: "white" }}
            >
              Zauzeto
            </Text>
          </Col>
          <Col span={5}></Col>
        </Row>
        <Row>
          <Col span={5}></Col>
          <Col span={14} style={{ textAlign: "center" }}>
            <Text type="secondary" style={{ fontSize: "25px", color: "white" }}>
              {title} {start} - {end}
            </Text>
          </Col>
          <Col span={5}></Col>
        </Row>
        <Row style={{ height: "100px" }}></Row>
        <Row style={{ height: "32px" }}>
          <Col span={7}></Col>
          <Col span={7}></Col>
          <Col span={6}></Col>
          <Col span={4}>
            <Button>
              <Link to="/scheduler">Dodaj sastanak</Link>
            </Button>
          </Col>
        </Row>
        <Row style={{ height: "71px" }}></Row>
      </Content>
    );
  }
}

export default Occupied;
