import { CALENDAR_CONFIG } from 'config';
import React from 'react';
import ReactDOM from 'react-dom';
import Store from './Store';
import Schedule from './components/Schedule';

class ScheduleManager {
  constructor() {
    const { apiKey, calendarId } = CALENDAR_CONFIG;
    const url =  encodeURI(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}`);

    fetch(url).then((r) => r.json()).then(data => {
      ReactDOM.render(
        <Store data={data}>
          {store => <Schedule store={store} />}
        </Store>,
        document.querySelector('#schedule')
      );
    });
  }
}

export default ScheduleManager;
