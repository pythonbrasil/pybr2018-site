import { CALENDAR_CONFIG } from 'config';
import React from 'react';
import get from 'lodash/get';
import ScrollNavigation from 'scroll-navigation-menu';
import { StickyContainer, Sticky } from 'react-sticky';
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
    const anchorsOffset = document.querySelector('.filters').getBoundingClientRect().height;
    const anchors = new ScrollNavigation({
      offset: -anchorsOffset
    });

    anchors.start();
  }

  filterEvents(event) {
    return !event.details
      || (this.state.typeFilter.includes(event.details.eventType)
          && (!event.details.category || this.state.categoryFilter.includes(event.details.category)));
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
              <DayMenu days={Object.keys(days)} selectedDay={selectedDay} onClick={this.onClick}/>
              <CategoryFilter
                categories={talksCategories}
                filter={categoryFilter}
                onChange={this.onCategoryFilterChange}
              />
              <EventTypeFilter
                types={eventTypes}
                filter={typeFilter}
                onChange={this.onTypeFilterChange}
              />
            </div>
          )}
        </Sticky>
       {Object.keys(days).map(day => (
          <React.Fragment key={day}>
            <div id={`day${day}`} className="day-separator tab-link">
              Dia {day}
            </div>
            <hr/>
            {days[day].filter(this.filterEvents).map(event => (
              <Event event={event} key={event.id} />
            ))}
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
