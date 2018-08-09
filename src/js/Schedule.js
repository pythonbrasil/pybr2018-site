import { CALENDAR_CONFIG } from 'config';

class Schedule {
  constructor() {
    const { apiKey, calendarId } = CALENDAR_CONFIG;
    const url =  encodeURI(`https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}`);

    fetch(url).then((r) => r.json()).then(r => console.log(r));
  }
}

export default new Schedule();
