import React from "react";
import moment from "moment";
import { withFirebase } from "../../../firebase";
import uuid from "uuid";
import { Link } from "react-router-dom";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button, Row, Col, Modal } from "antd";

const prodServerAddress = process.env.REACT_APP_PROD_SERVER_NAME;
const devServerAddress = process.env.REACT_APP_DEV_SERVER_NAME;

const serverAddress =
  process.env.NODE_ENV === "production" ? prodServerAddress : devServerAddress;

class MyCalendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [
        {},
        {},
        {
          id: 1,
          title: "Long Event",
          start: new Date(2019, 19, 2, 18, 0),
          end: new Date(2019, 19, 2, 19, 0)
        }
      ],
      modalVisibility: false,
      modalTitle: "",
      eventId: ""
    };
  }

  componentDidMount() {
    this.callAPIfetchEvents();
  }

  callAPIfetchEvents() {
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

  callAPIaddEvent(title, start, end) {
    var id = uuid();
    var url =
      serverAddress +
      "/api/events/add/" +
      id +
      "/" +
      title +
      "/" +
      start +
      "/" +
      end;
    fetch(url)
      .then(res => res.json())
      .catch(function(error) {
        console.log(error);
      });
  }

  callAPIdeleteEvent(id) {
    var url = serverAddress + "/api/events/delete/" + id;
    fetch(url)
      .then(res => res.json())
      .catch(function(error) {
        console.log(error);
      });
  }

  setUnixTimeToDate(unixTime) {
    var timeStamp = new Date(unixTime * 1000);
    var year = timeStamp.getFullYear();
    var month = timeStamp.getMonth();
    var day = timeStamp.getDate();
    var hour = timeStamp.getHours();
    var min = timeStamp.getMinutes();

    var dateTime = year + "," + month + "," + day + "," + hour + "," + min;

    return dateTime;
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

  handleSelect = ({ start, end }) => {
    const title = window.prompt("New Event name");
    if (title)
      this.setState({
        events: [
          ...this.state.events,
          {
            start,
            end,
            title
          }
        ]
      });

    const unixStart = this.setTimeToUnix(start);
    const unixEnd = this.setTimeToUnix(end);
    this.callAPIaddEvent(title, unixStart, unixEnd);
  };

  showModal = (title, id) => {
    this.setState({
      modalVisibility: true,
      modalTitle: title,
      eventId: id
    });
  };

  handleDelete = e => {
    console.log(e);
    const { eventId } = this.state;
    this.setState({
      modalVisibility: false
    });
    this.deleteEvent(eventId);
  };

  deleteEvent(id) {
    const { events } = this.state;
    const newEvents = events.filter(event => event.id !== id);
    this.setState({
      events: newEvents
    });
    this.callAPIdeleteEvent(id);
  }

  handleClose = e => {
    console.log(e);
    this.setState({
      modalVisibility: false
    });
  };

  render() {
    const localizer = momentLocalizer(moment);
    return (
      <div>
        <Row>
          <Col span={10}></Col>
          <Col span={8}></Col>
          <Col span={2}>
            <Button type="primary" style={{ width: "100%" }}>
              <Link to="/home">Back</Link>
            </Button>
          </Col>
          <Col span={2}>
            <Button type="primary" style={{ width: "100%" }}>
              <Link to="/password-change"> Edit </Link>
            </Button>
          </Col>
          <Col span={2}>
            <Button type="primary" style={{ width: "100%" }}>
              <Link to="/" onClick={this.props.firebase.doSignOut}>
                Sign out
              </Link>
            </Button>
          </Col>
        </Row>
        <Calendar
          style={{ height: "600px" }}
          selectable
          showMultiDayTimes
          localizer={localizer}
          events={this.state.events}
          defaultView={Views.WEEK}
          scrollToTime={new Date(1970, 1, 1, 6)}
          defaultDate={new Date(2015, 3, 12)}
          onSelectEvent={event => this.showModal(event.title, event.id)}
          onSelectSlot={this.handleSelect}
        />
        <Modal
          title="Sastanak"
          visible={this.state.modalVisibility}
          onOk={this.handleDelete}
          cancelText={"Close"}
          okText={"Delete"}
          onCancel={this.handleClose}
          key={this.state.eventId}
        >
          <p>{this.state.modalTitle}</p>
        </Modal>
      </div>
    );
  }
}

export default withFirebase(MyCalendar);
