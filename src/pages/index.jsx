import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import * as ROUTES from "../constants/routes";

import HomePage from "./home";
import SchedulerPage from "./scheduler";
import { Layout } from "antd";
import LogIn from "./login";
import PasswordChange from "./passwordChange";

const prodServerAddress = process.env.REACT_APP_PROD_SERVER_NAME;
const devServerAddress = process.env.REACT_APP_DEV_SERVER_NAME;

const serverAddress =
  process.env.NODE_ENV === "production" ? prodServerAddress : devServerAddress;

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  callAPI() {
    fetch(serverAddress + "/api")
      .then(res => res.text())
      .then(res => this.setState({ apiResponse: res }));
  }

  componentDidMount() {
    this.callAPI();
  }
  render() {
    return (
      <div>
        <Layout>
          <Router>
            <Route exact path={ROUTES.LOGIN} component={LogIn} />
            <Route exact path={ROUTES.HOME} component={HomePage} />
            <Route path={ROUTES.SCHEDULER} component={SchedulerPage} />
            <Route path={ROUTES.PASSWORDCHANGE} component={PasswordChange} />
          </Router>
        </Layout>
      </div>
    );
  }
}

export default App;
