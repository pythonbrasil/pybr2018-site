import { CALENDAR_CONFIG } from 'config';
import React from 'react';
import get from 'lodash/get';
import ScrollNavigation from 'scroll-navigation-menu';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

const Event = ({ event }) => (
  <article key={event.etag} className="schedule_article">
    <h5 className="schedule_time">{event.date.getHours()}h</h5>
    <div className="picture-container">
      <div className="schedule_picture">
      </div>
    </div>
    <div className="schedule_info">
      {event.details
        ? (
          <React.Fragment>
            <h2 className="schedule_name">{event.details.name}</h2>
            <h4 className="schedule_office">
              {event.details.title}
            </h4>
            <h3 className="schedule_speak">
              <span className="schedule_category">{event.details.category}</span>
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

const DayMenu = ({ days, selectedDay, onClick }) => (
  <ul className="accordion-tabs schedule_category_days">
    {days.map(day => (
      <li key={day} className="tab-header-and-content">
        <a
          href={`#day${day}`}
          className={classNames('tab-link scroll')}
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
    const eventTypes = [];
    const talksCategories = [];

    data.items.forEach(event => {
      const startDateTime = get(event, 'start.dateTime');
      if (!startDateTime) {
        return;
      }
      const dayOfEvent = new Date(startDateTime).getDate();
      if (!days[dayOfEvent]) days[dayOfEvent] = [];

      const pybrEvent = {
        id: event.id,
        date: new Date(startDateTime),
        summary: event.summary
      }
      if (event.description) {
        const [ name, title, eventType, category ] = event.description.split('|');

        pybrEvent.details = {
          name,
          title,
          eventType,
          category
        };

        if (!eventTypes.includes(eventType)) eventTypes.push(eventType);
        if (category && !talksCategories.includes(category)) talksCategories.push(category);
      }

      days[dayOfEvent].push(pybrEvent);
    });
    for (let day in days) {
      days[day].sort(this.sortByDate);
    }
    const selectedDay = Object.keys(days)[0];
    return {
      selectedDay,
      days,
      eventTypes,
      talksCategories
    }
  }

  onClick(selectedDay) {
    this.setState({
      selectedDay
    })
  }

  sortByDate(eventA, eventB) {
    if (eventA.date == eventB.date) {
      return 0;
    }

    return eventA.date > eventB.date ? 1 : -1;
  }

  constructor(props) {
    super(props);
    this.state = this.getInitialState(props.data);
    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    const anchors = new ScrollNavigation({
      offset: -100
    });

    anchors.start();
  }

  render() {
    const { days, selectedDay } = this.state;
    return (
      <React.Fragment>
        <DayMenu days={Object.keys(days)} selectedDay={selectedDay} onClick={this.onClick}/>
        {Object.keys(days).map(day => (
          <React.Fragment key={day}>
            <div id={`day${day}`} className="day-separator tab-link">
              Dia {day}
            </div>
            <hr/>
            {days[day].map(event => (
              <Event event={event} key={event.id} />
            ))}
          </React.Fragment>
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
