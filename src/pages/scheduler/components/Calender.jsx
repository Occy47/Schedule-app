import React from "react";
import moment from "moment";
import { withFirebase } from "../../../firebase";
import { withRouter } from "react-router-dom";
import { compose } from "recompose";
import uuid from "uuid";
import { Link } from "react-router-dom";
import { Calendar, momentLocalizer, Views } from "react-big-calendar";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Button, Row, Col, Modal, TimePicker, Input } from "antd";

const prodServerAddress = process.env.REACT_APP_PROD_SERVER_NAME;
const devServerAddress = process.env.REACT_APP_DEV_SERVER_NAME;

const serverAddress =
  process.env.NODE_ENV === "production" ? prodServerAddress : devServerAddress;

class MyCalendar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      events: [
        {
          id: 1,
          title: "Long Event",
          start: new Date(2019, 19, 2, 18, 0),
          end: new Date(2019, 19, 2, 19, 0)
        }
      ],
      modalVisibility: false,
      modalTitle: "",
      eventId: "",
      eventStart: new Date(2019, 19, 2, 18, 0),
      eventEnd: new Date(2019, 19, 2, 19, 0),
      scrollPosY: 0,
      ticking: false
    };
  }

  componentDidMount() {
    this.callAPIfetchEvents();
    const scheduler = document.getElementById("scheduler-comp");
    scheduler.addEventListener("click", () => this.timerFunction(this.props));
  }

  timerFunction() {
    //console.log("timer set for 8s");
    clearTimeout(this.backTimeOut);
    this.backTimeOut = setTimeout(
      () => this.props.history.push("/home"),
      150000
    );
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

  callAPIUpdateEvent(id, title, start, end) {
    var url =
      serverAddress +
      "/api/events/update/" +
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
    const title = window.prompt("Unesi ime tvrtke");
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

  showModal = (title, id, start, end) => {
    this.setState({
      modalVisibility: true,
      modalTitle: title,
      eventId: id,
      eventStart: start,
      eventEnd: end
    });
  };

  handleCancel = e => {
    this.setState({
      modalVisibility: false
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

  handleSave = e => {
    const { eventId, modalTitle, eventStart, eventEnd } = this.state;
    console.log(e);

    const filteredEvents = this.state.events.filter(
      event => event.id !== eventId
    );
    const newEvent = {
      id: eventId,
      title: modalTitle,
      start: eventStart,
      end: eventEnd
    };
    filteredEvents.push(newEvent);

    const unixStart = this.setTimeToUnix(eventStart);
    const unixEnd = this.setTimeToUnix(eventEnd);
    if (unixStart < unixEnd && modalTitle !== "") {
      this.callAPIUpdateEvent(eventId, modalTitle, unixStart, unixEnd);

      this.setState({
        events: filteredEvents,
        modalVisibility: false,
        modalTitle: "",
        eventId: "",
        eventStart: new Date(2019, 19, 2, 18, 0),
        eventEnd: new Date(2019, 19, 2, 19, 0)
      });
    } else {
      alert(
        "Provjerite podatke: `Ime tvrtke` ne može biti prazno i `Početak` sastanka ne može biti nakon `Kraja`"
      );
    }

    console.log(filteredEvents);
  };

  handleTimeFormating(time) {
    var hour = time.getHours();
    var min = ("0" + time.getMinutes()).slice(-2);

    var formatedTime = hour + ":" + min;

    return formatedTime;
  }

  onInputChange() {
    const title = document.getElementById("modal-input").value;
    this.setState({ modalTitle: title });
  }

  onStartTimePickerChange = time => {
    var timeStamp = new Date(time);
    console.log("on time picker " + timeStamp);
    this.setState({ eventStart: timeStamp });
  };

  onEndTimePickerChange = time => {
    var timeStamp = new Date(time);
    console.log("on time picker " + timeStamp);
    this.setState({ eventEnd: timeStamp });
  };

  componentWillUnmount() {
    const scheduler = document.getElementById("scheduler-comp");
    scheduler.removeEventListener("click", this.timerFunction);
  }

  render() {
    const localizer = momentLocalizer(moment);

    const { eventId, modalTitle, eventStart, eventEnd } = this.state;
    const item = { eventId, modalTitle, eventStart, eventEnd };
    console.log(item);
    return (
      <div id="scheduler-comp">
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
          step={15}
          selectable
          showMultiDayTimes
          localizer={localizer}
          events={this.state.events}
          defaultView={Views.WEEK}
          scrollToTime={new Date(1970, 1, 1, 6)}
          defaultDate={new Date(2015, 3, 12)}
          onSelectEvent={event =>
            this.showModal(event.title, event.id, event.start, event.end)
          }
          onSelectSlot={this.handleSelect}
        />
        <div id="event-modal">
          <Modal
            title="Sastanak"
            visible={this.state.modalVisibility}
            key={this.state.eventId}
            centered={true}
            onCancel={this.handleCancel}
            footer={[
              <Button key="back" onClick={this.handleDelete}>
                Obriši
              </Button>,
              <Button key="submit" type="primary" onClick={this.handleSave}>
                Spremi
              </Button>
            ]}
          >
            <Row>
              <Col span={8}>Ime tvrtke:</Col>
              <Input
                id="modal-input"
                defaultValue={modalTitle}
                onChange={() => this.onInputChange()}
              />
            </Row>
            <Row>
              <Col span={10}></Col>
              <Col span={7}>Početak:</Col>
              <Col span={7}>Kraj:</Col>
            </Row>
            <Row>
              <Col span={10}></Col>
              <Col span={7}>
                <TimePicker
                  style={{ width: "100%" }}
                  format="HH:mm"
                  hourStep={1}
                  minuteStep={5}
                  defaultValue={moment(
                    this.handleTimeFormating(eventStart),
                    "HH:mm"
                  )}
                  onChange={this.onStartTimePickerChange}
                  value={moment(this.handleTimeFormating(eventStart), "HH:mm")}
                ></TimePicker>
              </Col>
              <Col span={7}>
                <TimePicker
                  style={{ width: "100%" }}
                  format="HH:mm"
                  hourStep={1}
                  minuteStep={5}
                  defaultValue={moment(
                    this.handleTimeFormating(eventEnd),
                    "HH:mm"
                  )}
                  onChange={this.onEndTimePickerChange}
                  value={moment(this.handleTimeFormating(eventEnd), "HH:mm")}
                ></TimePicker>
              </Col>
            </Row>
          </Modal>
        </div>
      </div>
    );
  }
}

export default compose(withFirebase, withRouter)(MyCalendar);
