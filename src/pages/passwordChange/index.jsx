import React, { Component } from "react";
import { withFirebase } from "../../firebase";
import { Link } from "react-router-dom";
import { Row, Col, Form, Input, Button } from "antd";

const INITIAL_STATE = {
  passwordOne: "",
  passwordTwo: "",
  error: null
};

const layout = {
  labelCol: {
    span: 8
  },
  wrapperCol: {
    span: 16
  }
};
const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16
  }
};

class PasswordChangeForm extends Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }
  onSubmit = event => {
    const { passwordOne } = this.state;
    this.props.firebase
      .doPasswordUpdate(passwordOne)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
      })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
  };
  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  render() {
    const { passwordOne, passwordTwo, error } = this.state;
    const isInvalid = passwordOne !== passwordTwo || passwordOne === "";
    return (
      <div>
        <Row style={{ height: "216px" }}></Row>
        <Row justify="space-around" align="middle">
          <Col span={6}></Col>
          <Col span={12}>
            <Form {...layout} name="control-hooks" onSubmit={this.onSubmit}>
              <Form.Item
                label="New password"
                name="passwordOne"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!"
                  }
                ]}
              >
                <Input.Password
                  name="passwordOne"
                  value={passwordOne}
                  onChange={this.onChange}
                />
              </Form.Item>
              <Form.Item
                label="Confirm new password"
                name="passwordTwo"
                rules={[
                  {
                    required: true,
                    message: "Please input your password!"
                  }
                ]}
              >
                <Input.Password
                  name="passwordTwo"
                  value={passwordTwo}
                  onChange={this.onChange}
                />
              </Form.Item>
              <Form.Item {...tailLayout}>
                <Button type="primary" disabled={isInvalid} htmlType="submit">
                  Change My Password
                </Button>
                <Button type="primary">
                  <Link to="/scheduler" onClick={this.props.firebase.doSignOut}>
                    Cancel
                  </Link>
                </Button>
                {error && <p>{error.message}</p>}
              </Form.Item>
            </Form>
          </Col>
          <Col span={6}></Col>
        </Row>
        <Row style={{ height: "216px" }}></Row>
      </div>
    );
  }
}
export default withFirebase(PasswordChangeForm);
