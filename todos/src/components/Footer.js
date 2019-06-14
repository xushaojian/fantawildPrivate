import React from 'react';
import { VisibilityFilters } from '../actions';
import FilterLink from '../containers/FilterLink';

const Footer = () => (
  <div>
    <span>显示 : </span>
    <FilterLink filter={VisibilityFilters.SHOW_ALL}>
      所有
    </FilterLink>
    <FilterLink filter={VisibilityFilters.SHOW_ACTIVE}>
      待办1
    </FilterLink>
    <FilterLink filter={VisibilityFilters.SHOW_COMPLETED}>
      已完成ok
    </FilterLink>
  </div>
)

export default Footer
