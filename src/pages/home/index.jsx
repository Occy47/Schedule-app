import React from "react";
import Vaccant from "./components/Vaccant";
import Occupied from "./components/Occupied";
import "antd/dist/antd.css";
import "./home.css";
import { Layout } from "antd";

const prodServerAddress = process.env.REACT_APP_PROD_SERVER_NAME;
const devServerAddress = process.env.REACT_APP_DEV_SERVER_NAME;

const serverAddress =
  process.env.NODE_ENV === "production" ? prodServerAddress : devServerAddress;

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      events: [
        {
          id: 0,
          title: "0",
          start: "0",
          end: "0"
        },
        {
          id: 1,
          title: "1",
          start: "1",
          end: "1"
        }
      ],
      vaccant: true,
      timeNow: 0
    };
    this.setNowTimeToUnix = this.setNowTimeToUnix.bind(this);
    this.chechIfMeeting = this.chechIfMeeting.bind(this);
    this.setAndCheck = this.setAndCheck.bind(this);
  }

  componentDidMount() {
    this.callAPI();

    this.interval = setInterval(() => this.setAndCheck(), 10000);
  }

  callAPI() {
    fetch(serverAddress + "/api/events")
      .then(res => res.json())
      .then(res => {
        let events = res.events;
        for (let i = 0; i < events.length; i++) {
          events[i].start = new Date(events[i].start * 1000);
          events[i].end = new Date(events[i].end * 1000);
        }
        this.setState({
          events: events
        });
      })
      .catch(function(error) {
        console.log(error);
      });
  }

  setAndCheck() {
    this.setNowTimeToUnix();
    const { timeNow, events } = this.state;
    events.map(event =>
      this.chechIfMeeting(
        this.setTimeToUnix(event.start),
        this.setTimeToUnix(event.end),
        timeNow
      )
    );
  }

  setNowTimeToUnix() {
    var now = new Date();
    var year = now.getFullYear();
    var month = now.getMonth();
    var day = now.getDate();
    var hour = now.getHours();
    var min = now.getMinutes();

    var unixTime = new Date(year, month, day, hour, min).getTime() / 1000;

    this.setState({ timeNow: unixTime });
  }

  setTimeToUnix(time) {
    var year = time.getFullYear();
    var month = time.getMonth();
    var day = time.getDate();
    var hour = time.getHours();
    var min = time.getMinutes();

    var unixTime = new Date(year, month, day, hour, min).getTime() / 1000;

    return unixTime;
  }

  chechIfMeeting(start, end, now) {
    if (start < now && end > now) this.setState({ vaccant: false });
    else this.setState({ vaccant: true });
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }
  render() {
    const { vaccant } = this.state;
    console.log(this.state.events);
    return <Layout>{vaccant ? <Vaccant /> : <Occupied />}</Layout>;
  }
}

export default Home;
