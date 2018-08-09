import { CALENDAR_CONFIG } from 'config';
import React from 'react';
import ReactDOM from 'react-dom';



const Event = ({ event }) => (
  <article key={event.etag} className="schedule_article">
    <h5 className="schedule_time">{new Date(event.start.dateTime).getHours()}h</h5>
    <div className="picture-container">
      <div className="schedule_picture">
      </div>
    </div>
    <div className="schedule_info">
      {event.description
        ? (
          <React.Fragment>
            <h2 className="schedule_name">{event.description.split('|')[0]}</h2>
            <h4 className="schedule_office">
              {event.description.split('|')[1]}
            </h4>
            <h3 className="schedule_speak">
              <span className="schedule_category">WEB</span>
              {event.summary}
            </h3>
          </React.Fragment>
        ) : (
          <h2 className="schedule_name">{event.summary}</h2>
        )
      }
    </div>
  </article>
);

const DayMenu = ({ days, onClick }) => (
  <ul className="accordion-tabs schedule_category_days">
    {days.map(day => (
      <li key={day} className="tab-header-and-content">
        <a
          href="javascript:void(0)"
          onClick={() => onClick(day)}
          className="tab-link active"
        >
          Dia {day}
        </a>
      </li>
    ))}
  </ul>
);

class Schedule extends React.Component {
  getInitialState(data) {
    const days = {};
    data.items.forEach(event => {
      const dayOfEvent = new Date(event.start.dateTime).getDate();
      if (!days[dayOfEvent]) {
        days[dayOfEvent] = [];
      }

      days[dayOfEvent].push(event);
    });

    const selectedDay = Object.keys(days)[0];
    return {
      selectedDay,
      days,
    }
  }

  onClick(selectedDay) {
    this.setState({
      selectedDay
    })
  }

  sortByDate(eventA, eventB) {
    const dateA = new Date(eventA.start.dateTime);
    const dateB = new Date(eventB.start.dateTime);

    if (dateA == dateB) {
      return 0;
    }

    return dateA > dateB ? 1 : -1;
  }

  constructor(props) {
    super(props);
    this.state = this.getInitialState(props.data);
    this.onClick = this.onClick.bind(this);
  }

  render() {
    return (
      <React.Fragment>
        <DayMenu days={Object.keys(this.state.days)} onClick={this.onClick}/>
        {this.state.days[this.state.selectedDay].sort(this.sortByDate).map(event => (
          <Event event={event} key={event.id} />
        ))}
      </React.Fragment>
    )
  }
}

class ScheduleManager {
  constructor() {
    const { apiKey, calendarId } = CALENDAR_CONFIG;
    const url =  encodeURI(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}`);

    fetch(url).then((r) => r.json()).then(data => {
      ReactDOM.render(
        <Schedule data={data} />,
        document.querySelector('#schedule')
      );
    });
  }
}

export default ScheduleManager;
