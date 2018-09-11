import React from 'react';
import classNames from 'classnames';
import { getFormattedTime } from 'app/schedule-app/utils';

const EventTypes = (event) => ({
  ['Eventos Fixos']: (
    <h2 className="schedule_name w-100">{event.summary}</h2>
  ),
  ['Palestra']: (
    <React.Fragment>
      <h2 className="schedule_name">
        {event.summary}
        {event.details.category &&
          <span className={`schedule_category ${event.details.category.toLowerCase().replace(/\s/g, '-')}`}>
            {event.details.category}
          </span>
        }
      </h2>
      <h3 className="schedule_speaker">
        {event.details.name}
      </h3>
      <h4 className="schedule_office">
        {event.details.title}
      </h4>
    </React.Fragment>
  ),
  ['Tutorial']: (
    <React.Fragment>
      <h2 className="schedule_name">
        {event.summary}
      </h2>
      <h3 className="schedule_speaker">
        Duração: {event.details.duration}
      </h3>
      <h3 className="schedule_speaker">
        {event.details.name}
      </h3>
      <h4 className="schedule_office">
        {event.details.title}
      </h4>
    </React.Fragment>
  ),
  ['Keynote']: (
    <React.Fragment>
      <h2 className="schedule_name">
        {event.summary}
        {event.details.category &&
          <span className={`schedule_category ${event.details.category.toLowerCase().replace(/\s/g, '-')}`}>
            {event.details.category}
          </span>
        }
      </h2>
      <h3 className="schedule_speaker">
        {event.details.name}
      </h3>
      <h4 className="schedule_office">
        {event.details.title}
      </h4>
    </React.Fragment>
  ),
  ['Sprints']: (
    <React.Fragment>
      <h2 className="schedule_name">
        {event.summary}
      </h2>
      <h3 className="schedule_speaker">
        {event.details.description}
      </h3>
    </React.Fragment>
  ),
});

const Events = ({ scheduleInDate }) => (
  <article className="schedule_article">
    <h5 className="schedule_time">{getFormattedTime(scheduleInDate.date)}</h5>
    <div className="picture-container">
      <div className="schedule_picture">
      </div>
    </div>
    <div className="row w-100">
    {scheduleInDate.events.map(event => (
      <div key={event.id} className={classNames('schedule_info col-xl-3 col-lg-6 col-sm-12', {
        'schedule-highlight': event.details.eventType !== 'Eventos Fixos'
      })}>
        {EventTypes(event)[event.details.eventType]}
      </div>
    ))}
    </div>
  </article>
);

export default Events;
