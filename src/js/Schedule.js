import { CALENDAR_CONFIG } from 'config';
import React from 'react';
import get from 'lodash/get';
import ScrollNavigation from 'scroll-navigation-menu';
import { StickyContainer, Sticky } from 'react-sticky';
import ReactDOM from 'react-dom';
import classNames from 'classnames';

function getDayLabel(day){
  switch(day){
    case `17`:
    case `18`:
      return `Sprints`;
      break;
    case `19`:
    case `20`:
    case `21`:
      return `Palestras`
      break;
    default:
      return `Tutoriais`
  }
}

function getFormattedTime(time) {
  const hours = time.getHours();
  const minutes = time.getMinutes();

  return `${hours < 10 ? '0' + hours : hours}h${minutes < 10 ? '0' + minutes : minutes}`;
}

const Events = ({ scheduleInDate }) => (
  <article className="schedule_article">
    <h5 className="schedule_time">{getFormattedTime(scheduleInDate.date)}</h5>
    <div className="picture-container">
      <div className="schedule_picture">
      </div>
    </div>
    <div className="row w-100">
    {scheduleInDate.events.map(event => (
      <div key={event.id} className={classNames(
        'schedule_info',
        {
          'col-xl-3 col-lg-6 col-sm-12 schedule-highlight': event.details
        }
      )}>
        {event.details
          ? (
            <React.Fragment>
              <h2 className="schedule_name">{event.summary} <span className="schedule_category"> {event.details.category}</span></h2>
              <h3 className="schedule_speaker">
                {event.details.name}
              </h3>
              <h4 className="schedule_office">
                {event.details.title}
              </h4>
            </React.Fragment>
          ) : (
            <h2 className="schedule_name w-100">{event.summary}</h2>
          )
        }
      </div>
    ))}
    </div>
  </article>
);

const DaySeparator = ({ day }) => (
  <React.Fragment>
    <div className="day-separator tab-link">
      Dia {day} – <span>{getDayLabel(day)}</span>
    </div>
  </React.Fragment>
);


const DayMenu = ({ days, selectedDay, onClick }) => (
  <ul className="accordion-tabs schedule_category_days">
    {Object.keys(days).map(day => (
      <li key={day} className="tab-header-and-content">
        <a
          href={`#day${day}`}
          className={classNames('tab-link', {'disabled': !days[day].length, 'scroll': days[day].length})}
        >
          {day}
        </a>
      </li>
    ))}
  </ul>
);

const FilterCheckbox = ({ checked, onChange, label, ...props }) => (
  <label className="schedule_category" { ...props }>
    <input
      checked={checked}
      type="checkbox"
      onChange={onChange}
    />
    {label}
  </label>
)

const EventTypeFilter = ({ types, onChange, filter }) => (
  <div className="category-filter">
    <h2>Filtrar eventos por tipo</h2>
    {types.map(type => (
      <FilterCheckbox
        checked={filter.includes(type)}
        onChange={() => onChange(type)}
        label={type}
        key={type}
      />
    ))}
  </div>
)

const CategoryFilter = ({ categories, onChange, filter }) => (
  <div className="category-filter">
    <h2>Filtrar palestras por categoria</h2>
    {categories.map(category => (
      <FilterCheckbox
        checked={filter.includes(category)}
        key={category}
        onChange={() => onChange(category)}
        label={category}
      />
    ))}
  </div>
)

class Schedule extends React.Component {
  getInitialState(data) {
    const days = {'17': [], '18': [], '22': []};
    const eventTypes = [];
    const talksCategories = [];

    data.items.forEach(event => {
      const startDateTime = get(event, 'start.dateTime');
      if (!startDateTime) {
        return;
      }
      const dayOfEvent = new Date(startDateTime).getDate();
      if ([17, 18, 22].includes(dayOfEvent)) {
        return;
      }
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
      const eventsOnSameTime = days[dayOfEvent].find(h => h.date.getTime() == pybrEvent.date.getTime());
      if (!eventsOnSameTime) {
        days[dayOfEvent].push({
          date: pybrEvent.date,
          events: [pybrEvent]
        })
      } else {
        eventsOnSameTime.events.push(pybrEvent);
      }
    });
    for (const day in days) {
      days[day].sort(this.sortByDate);
    }
    console.log(days);
    const selectedDay = Object.keys(days)[0];
    return {
      selectedDay,
      days,
      eventTypes,
      talksCategories,
      categoryFilter: [ ...talksCategories ],
      typeFilter: [ ...eventTypes ]
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
    this.onCategoryFilterChange = this.onFilterChange.bind(this, 'categoryFilter');
    this.onTypeFilterChange = this.onFilterChange.bind(this, 'typeFilter');
    this.onClick = this.onClick.bind(this);
    this.filterEvents = this.filterEvents.bind(this);
  }

  onFilterChange(filterType, filter) {
    const state = this.state;
    if (state[filterType].includes(filter)) {
      this.setState((state) => ({
        ...state,
        [filterType]: state[filterType].filter(f => f !== filter)
      }))
    } else {
      this.setState((state) => ({
        ...state,
        [filterType]: [ ...state[filterType], filter ]
      }))
    }
  }

  componentDidMount() {
    requestAnimationFrame(() => {
      const anchorsOffset = document.querySelector('.filters').getBoundingClientRect().height;
      const anchors = new ScrollNavigation({
        offset: -anchorsOffset - 120
      });
      anchors.start();
    });
  }

  filterEvents(event) {
    return true;
    return !event.details
      || (this.state.typeFilter.includes(event.details.eventType)
          && (!event.details.category || this.state.categoryFilter.includes(event.details.category)));
  }

  renderDay(day, label) {
    if (day.length) {
      return (
        <div id={`day${label}`} >
          <DaySeparator day={label}/>
          {day.filter(this.filterEvents).map(events => (
            <Events scheduleInDate={events} key={getFormattedTime(events.date)} />
          ))}
        </div>
      )
    }
 }

  render() {
    const { days, selectedDay, talksCategories, categoryFilter, eventTypes, typeFilter } = this.state;
    return (
      <StickyContainer>
        <Sticky>
          {({ style, isSticky }) => (
            <div
              className={classNames('filters', { 'sticky': isSticky })}
              style={style}
            >
              <DayMenu days={days} selectedDay={selectedDay} onClick={this.onClick}/>
              {/*<CategoryFilter
                categories={talksCategories}
                filter={categoryFilter}
                onChange={this.onCategoryFilterChange}
              />
              <EventTypeFilter
                types={eventTypes}
                filter={typeFilter}
                onChange={this.onTypeFilterChange}
              />*/}
            </div>
          )}
        </Sticky>
       {Object.keys(days).map(day => (
          <React.Fragment key={day}>
            {this.renderDay(days[day], day)}
          </React.Fragment>
        ))}
      </StickyContainer>
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
