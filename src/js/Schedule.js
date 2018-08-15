import { CALENDAR_CONFIG } from 'config';
import React from 'react';
import get from 'lodash/get';
import defaultTo from 'lodash/defaultTo';
import every from 'lodash/every';
import mapValues from 'lodash/mapValues';
import map from 'lodash/map';
import ScrollNavigation from 'scroll-navigation-menu';
import { StickyContainer, Sticky } from 'react-sticky';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import Popover from 'react-popover';

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

class FilterBox extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      popoverAppendTarget: null
    };

    this.setPopoverAppendTarget = this.setPopoverAppendTarget.bind(this);
  }

  setPopoverAppendTarget(ref) {
    this.setState({
      popoverAppendTarget: document.querySelector('.header__nav')
    });
  }

  render() {
    const { value, onChange, onClick, isPopoverOpened, advancedFilters } = this.props;
    return (
      <div className="filter-box" ref={this.setPopoverAppendTarget}>
        <div className="filters-search">
          <i className="material-icons">search</i>
          <input value={value} onChange={onChange} placeholder="Pesquisar palestra, autor..."/>
        </div>
        {this.state.popoverAppendTarget &&
          <Popover
            preferPlace="below"
            refreshIntervalMs={100}
            enterExitTransitionDurationMs={0}
            onOuterAction={onClick}
            isOpen={isPopoverOpened}
            body={advancedFilters}
          >
            <button onClick={onClick} className="filters-button">
              <i className="material-icons">filter_list</i>
            </button>
          </Popover>
        }
      </div>
    );
  }
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
          'col-xl-3 col-lg-6 col-sm-12 schedule-highlight': event.details.eventType !== 'meta'
        }
      )}>
        {event.details.eventType !== 'meta'
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
    const eventTypes = ['meta'];
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
        summary: event.summary,
        details: {
          eventType: 'meta'
        }
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
    this.state = {
      ...this.getInitialState(props.data),
      searchFilter: '',
      isShowingAdvancedFilters: false
    }
    this.onCategoryFilterChange = this.onFilterChange.bind(this, 'categoryFilter');
    this.onTypeFilterChange = this.onFilterChange.bind(this, 'typeFilter');
    this.onClick = this.onClick.bind(this);
    this.filterEvents = this.filterEvents.bind(this);
    this.toggleAdvancedFilters = this.toggleAdvancedFilters.bind(this);
    this.onSearchFilterChange = this.onSearchFilterChange.bind(this);
    this.checkSearchMatch = this.checkSearchMatch.bind(this);
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

  onSearchFilterChange(e) {
    this.setState({
      searchFilter: e.target.value
    })
  }

  toggleAdvancedFilters() {
    this.setState(state => ({
      ...state,
      isShowingAdvancedFilters: !state.isShowingAdvancedFilters
    }))
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

  checkSearchMatch(event) {
    const searchRegex = new RegExp(this.state.searchFilter.toLowerCase(), 'i');
    return defaultTo(get(event, 'details.title'), '').match(searchRegex)
      || defaultTo(get(event, 'details.name'), '').match(searchRegex)
      || defaultTo(get(event, 'summary'), '').match(searchRegex);
  }

  filterEvents(acc, { date, events }) {
    const filteredEvents = events.filter(event => (
      this.state.typeFilter.includes(event.details.eventType)
        && (!event.details.category || this.state.categoryFilter.includes(event.details.category))
        && (!this.state.searchFilter || this.checkSearchMatch(event))
    ));
    if (filteredEvents.length)
      return [ ...acc, { date, events: filteredEvents } ];
    return acc;
  }

  renderDay(day, label) {
    if (day.length) {
      return (
        <div id={`day${label}`} >
          <DaySeparator day={label}/>
          {day.map(events => (
            <Events scheduleInDate={events} key={getFormattedTime(events.date)} />
          ))}
        </div>
      )
    }
 }

  render() {
    const { days, selectedDay, talksCategories, categoryFilter, eventTypes, typeFilter, searchFilter } = this.state;
    const filteredDays = mapValues(days, day => day.reduce(this.filterEvents, []));
    const isListEmpty = every(filteredDays, day => !day.length);
    return (
      <StickyContainer>
        <Sticky>
          {({ style, isSticky }) => (
            <div
              className={classNames('filters', { 'sticky': isSticky })}
              style={style}
            >
              <DayMenu days={days} selectedDay={selectedDay} onClick={this.onClick}/>
              <FilterBox
                value={searchFilter}
                onClick={this.toggleAdvancedFilters}
                onChange={this.onSearchFilterChange}
                isPopoverOpened={this.state.isShowingAdvancedFilters}
                advancedFilters={
                  <div className="advanced-filters">
                    <h2>Filtrar por</h2>
                    <h3>Categoria</h3>
                    <CategoryFilter
                      categories={talksCategories}
                      filter={categoryFilter}
                      onChange={this.onCategoryFilterChange}
                    />
                    <h3>Tipo</h3>
                    <EventTypeFilter
                      types={eventTypes}
                      filter={typeFilter}
                      onChange={this.onTypeFilterChange}
                    />
                  </div>
                }
              />
            </div>
          )}
        </Sticky>
       {isListEmpty && <p className="empty-message">Nenhum evento encontrado.</p>}
       {map(filteredDays, (day, label) => (
          <React.Fragment key={label}>
            {this.renderDay(day, label)}
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
