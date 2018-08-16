import React from 'react';
import map from 'lodash/map';
import classNames from 'classnames';
import { Sticky, StickyContainer } from 'react-sticky';
import DayMenu from './DayMenu';
import DaySeparator from './DaySeparator';
import ScrollNavigation from 'scroll-navigation-menu';
import Events from './Events';
import { getFormattedTime } from 'app/schedule-app/utils';
import { FilterBox, CategoryFilter, EventTypeFilter } from './filters';

class Schedule extends React.Component {
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

  componentDidMount() {
    const anchorsOffset = document.querySelector('.filters').getBoundingClientRect().height;
    this.anchors = new ScrollNavigation({
      offset: -anchorsOffset - 120
    });
    this.anchors.start();
  }

  render() {
    const { store } = this.props;

    return (
      <StickyContainer>
        <Sticky>
          {({ style, isSticky }) => (
            <div
              className={classNames('filters', { 'sticky': isSticky })}
              style={style}
            >
              <DayMenu days={store.days} />
              <FilterBox
                value={store.searchFilter}
                onClick={store.actions.toggleAdvancedFilters}
                onChange={store.actions.onSearchFilterChange}
                isPopoverOpened={store.isShowingAdvancedFilters}
                advancedFilters={
                  <div className="advanced-filters">
                    <h2>Filtrar por</h2>
                    <h3>Categoria</h3>
                    <CategoryFilter
                      categories={store.talksCategories}
                      filter={store.categoryFilter}
                      onChange={store.actions.onCategoryFilterChange}
                    />
                    <h3>Tipo</h3>
                    <EventTypeFilter
                      types={store.eventTypes}
                      filter={store.typeFilter}
                      onChange={store.actions.onTypeFilterChange}
                    />
                  </div>
                }
              />
            </div>
          )}
        </Sticky>
       {store.isListEmpty && <p className="empty-message">Nenhum evento encontrado.</p>}
       {map(store.days, (day, label) => (
          <React.Fragment key={label}>
            {this.renderDay(day, label)}
          </React.Fragment>
        ))}
      </StickyContainer>
    )
  }
}

export default Schedule;
