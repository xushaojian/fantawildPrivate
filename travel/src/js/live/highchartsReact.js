var React = require('react')
var createReactClass = require('create-react-class')

var HighchartsReact = createReactClass({
	componentDidMount: function() {
		var p = this.props
		var highcharts = p.highcharts || window.Highcharts
		var constructorType = p.constructorType || 'chart'
		this.chart = highcharts[constructorType](this.container, Object.assign({}, p.options))
	},

	shouldComponentUpdate: function(nextProps, nextState) {
		var update = this.props.update
		return(typeof update === 'undefined') || update
	},

	componentDidUpdate: function() {
		this.chart.update(Object.assign({}, this.props.options), true, this.props.oneToOne || true)
	},

	componentWillReceiveProps: function() {
		this.chart.update(Object.assign({}, this.props.options), true, this.props.oneToOne || true)
	},

	componentWillUnmount: function() {
		this.chart.destroy()
	},

	render: function() {
		var self = this
		var containerProps = this.props.containerProps || {}

		containerProps.ref = function(container) {
			self.container = container
		}

		return React.createElement('div', containerProps)
	}
})

module.exports = HighchartsReact