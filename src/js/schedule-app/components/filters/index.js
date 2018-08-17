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

export class FilterBox extends React.Component {
  constructor(props) {
    super(props);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onSubmit(e) {
    e.preventDefault();
    this.input.blur();
  }

  render() {
    const { value, onChange, onClick, isPopoverOpened, advancedFilters } = this.props;
    return (
       <div className="filter-box">
         <form onSubmit={this.onSubmit} className="filters-search">
           <i className="material-icons">search</i>
           <input
             ref={input => this.input = input}
             value={value}
             onChange={onChange}
             placeholder="Pesquisar palestra, autor..."
            />
         </form>
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
   }
}

