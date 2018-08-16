import React from 'react';
import classNames from 'classnames';

const DayMenu = ({ days }) => (
  <ul className="accordion-tabs schedule_category_days">
    {Object.keys(days).map(day => (
      <li key={day} className="tab-header-and-content">
        <a
          href={`#day${day}`}
          className={classNames('tab-link', {
            'disabled': !days[day].length,
            'scroll': days[day].length
          })}
        >
          {day}
        </a>
      </li>
    ))}
  </ul>
);

export default DayMenu;
