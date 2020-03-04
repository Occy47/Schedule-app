import React from "react";
import { withRouter } from "react-router-dom";
import { withFirebase } from "../../firebase";
import { compose } from "recompose";
import * as ROUTES from "../../constants/routes";
import logo from "../../img/cpc_logo.png";
import { Modal, Input, Button, Row, Col } from "antd";

const INITIAL_STATE = {
  email: "",
  password: "",
  error: null,
  modalVisibility: false
};

const LogIn = () => (
  <div style={{ height: "600px", width: "1024px", backgroundColor: "#cacaca" }}>
    <LogInForm />
  </div>
);

class LogInFormBase extends React.Component {
  constructor(props) {
    super(props);
    this.state = { ...INITIAL_STATE };
  }

  componentDidMount() {
    setTimeout(this.showModal, 3000);
  }

  showModal = () => {
    this.setState({
      modalVisibility: true
    });
  };

  handleOk = e => {
    console.log(e);
    this.setState({
      modalVisibility: false
    });
  };

  handleCancel = e => {
    console.log(e);
    this.setState({
      modalVisibility: false
    });
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  onSubmit = event => {
    const { email, password } = this.state;
    this.props.firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });
    event.preventDefault();
  };

  onFinishFailed = errorInfo => {
    console.log("Failed:", errorInfo);
  };

  render() {
    const { email, password } = this.state;
    return (
      <Modal
        title="Scheduler"
        visible={this.state.modalVisibility}
        onOk={this.onSubmit}
        onCancel={this.handleCancel}
        footer={null}
        centered={true}
      >
        <img alt="logo" src={logo} />
        <br />
        <br />
        <Input
          required
          placeholder="Please enter your email"
          name="email"
          value={email}
          onChange={this.onChange}
        />
        <br />
        <br />
        <Input.Password
          required
          placeholder="Plese enter your password"
          name="password"
          value={password}
          onChange={this.onChange}
        />
        <br />
        <br />
        <Row justify="end">
          <Col span={8}></Col>
          <Col span={8}></Col>
          <Col span={4}></Col>
          <Col span={4}>
            <Button
              type="primary"
              onClick={this.onSubmit}
              style={{ width: "100%" }}
            >
              Log in
            </Button>
          </Col>
        </Row>
      </Modal>
    );
  }
}

const LogInForm = compose(withRouter, withFirebase)(LogInFormBase);

export default LogIn;

export { LogInForm };
