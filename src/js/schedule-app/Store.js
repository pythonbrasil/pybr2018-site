import React from 'react';
import get from 'lodash/get';
import defaultTo from 'lodash/defaultTo';
import every from 'lodash/every';
import mapValues from 'lodash/mapValues';

class Store extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ...this.reduceCalendarData(props.data),
      searchFilter: '',
      isShowingAdvancedFilters: false
    }
    
    this.actions = {
      onCategoryFilterChange: this.onFilterChange.bind(this, 'categoryFilter'),
      onTypeFilterChange: this.onFilterChange.bind(this, 'typeFilter'),
      filterEvents: this.filterEvents.bind(this),
      toggleAdvancedFilters: this.toggleAdvancedFilters.bind(this),
      onSearchFilterChange: this.onSearchFilterChange.bind(this),
      checkSearchMatch: this.checkSearchMatch.bind(this),
    }
  }

  reduceCalendarData(data) {
    const days = {};
    const eventTypes = ['Eventos Fixos', 'Sprints'];
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
        summary: event.summary,
        location: event.location,
        details: {
          eventType: event.summary === 'Sprints' ? event.summary : 'Eventos Fixos'
        }
      }

      if (event.description) {
        const [
          name,
          title,
          eventType,
          ...params
        ] = event.description.split('|').map(i => i.trim());

        pybrEvent.details = {
          name,
          title,
          eventType,
        };

        switch(eventType) {
          case 'Palestra':
            const [ category ] = params;
            pybrEvent.details.category = category;
            !talksCategories.includes(category) && talksCategories.push(category);
            break;
          case 'Tutorial':
            const [ duration, requirements, description ] = params;
            pybrEvent.details = { ...pybrEvent.details, duration, requirements, description }
            break;
          case undefined:
            pybrEvent.details = { eventType: 'Sprints', description: name };
            break;
        }
        if (eventType && !eventTypes.includes(eventType)) eventTypes.push(eventType);
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
    return {
      days,
      eventTypes,
      talksCategories,
      categoryFilter: [ ...talksCategories ],
      typeFilter: [ ...eventTypes ]
    }
  }

  sortByDate(eventA, eventB) {
    if (eventA.date == eventB.date) {
      return 0;
    }

    return eventA.date > eventB.date ? 1 : -1;
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

  render() {
    const { days} = this.state;
    const filteredDays = mapValues(days, day => day.reduce(this.actions.filterEvents, []));
    const isListEmpty = every(filteredDays, day => !day.length);
    return this.props.children({
      ...this.state,
      isListEmpty,
      days: filteredDays,
      actions: this.actions
    });
  }
}

export default Store;
