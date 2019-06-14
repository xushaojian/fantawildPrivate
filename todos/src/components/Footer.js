import React from 'react';
import { VisibilityFilters } from '../actions';
import FilterLink from '../containers/FilterLink';

const Footer = () => (
  <div>
    <span>显ok示 : </span>
    <FilterLink filter={VisibilityFilters.SHOW_ALL}>
      所有
    </FilterLink>
    <FilterLink filter={VisibilityFilters.SHOW_ACTIVE}>
      待ok办123
    </FilterLink>
    <FilterLink filter={VisibilityFilters.SHOW_COMPLETED}>
      已完成o98k
    </FilterLink>
  </div>
)

export default Footer
