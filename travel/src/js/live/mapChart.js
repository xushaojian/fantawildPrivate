import React from 'react'
import HighchartsReact from './highchartsReact'

const MapChart = ({ options, highcharts }) => <HighchartsReact
  highcharts={highcharts}
  constructorType={'mapChart'}
  options={options}
/>

export default MapChart
