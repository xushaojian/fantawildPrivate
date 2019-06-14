import React from 'react'
import FilterLink from '../containers/FilterLink'
import { VisibilityFilters } from '../actions'

const Footer = () => (
  <div>
    <span>Show: </span>
    <FilterLink filter={VisibilityFilters.SHOW_ALL}>
      所有
    </FilterLink>
    <FilterLink filter={VisibilityFilters.SHOW_ACTIVE}>
      待办
    </FilterLink>
    <FilterLink filter={VisibilityFilters.SHOW_COMPLETED}>
      已完成
    </FilterLink>
  </div>
)

export default Footer
