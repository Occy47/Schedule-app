import React from "react";
import { Spin, Modal, Row, Col } from "antd";

class LoadingMessage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <Modal visible={this.props.visible} footer={null} closable={false}>
        <Row>
          <Col span={8}></Col>
          <Col span={8} style={{ textAlign: "center" }}>
            <Spin size="large" />
          </Col>
          <Col span={8}></Col>
        </Row>
        <Row>
          <p style={{ textAlign: "center" }}>Molim pričekajte...</p>
        </Row>
      </Modal>
    );
  }
}

export default LoadingMessage;
