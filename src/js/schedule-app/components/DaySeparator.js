import React from 'react';
import { getDayLabel } from 'app/schedule-app/utils';

const DaySeparator = ({ day }) => (
  <React.Fragment>
    <div className="day-separator tab-link">
      Dia {day} – <span>{getDayLabel(day)}</span>
    </div>
  </React.Fragment>
);

export default DaySeparator;
