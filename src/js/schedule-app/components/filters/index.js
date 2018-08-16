import React from 'react';
import Popover from 'react-popover';

export const FilterCheckbox = ({ checked, onChange, label, ...props }) => (
  <label className="schedule_category" { ...props }>
    <input
      checked={checked}
      type="checkbox"
      onChange={onChange}
    />
    {` ${label}`}
  </label>
)

export const EventTypeFilter = ({ types, onChange, filter }) => (
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

export const CategoryFilter = ({ categories, onChange, filter }) => (
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

export const FilterBox = ({ value, onChange, onClick, isPopoverOpened, advancedFilters }) => (
  <div className="filter-box">
    <div className="filters-search">
      <i className="material-icons">search</i>
      <input value={value} onChange={onChange} placeholder="Pesquisar palestra, autor..."/>
    </div>
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
  </div>
);
