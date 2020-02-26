import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import * as ROUTES from "../constants/routes";

import HomePage from "./home";
import SchedulerPage from "./scheduler";
import { Layout } from "antd";

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { apiResponse: "" };
  }

  callAPI() {
    fetch("http://localhost:9000/API")
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
            <Route exact path={ROUTES.HOME} component={HomePage} />
            <Route path={ROUTES.SCHEDULER} component={SchedulerPage} />
          </Router>
        </Layout>
      </div>
    );
  }
}

export default App;
