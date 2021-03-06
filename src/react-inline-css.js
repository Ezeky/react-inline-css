/**
 * @copyright © 2015, Rick Wong. All rights reserved.
 */
var React      = require("react");
var PropTypes  = require("prop-types");
var assign     = Object.assign ? Object.assign : React.__spread;
var refCounter = 0;
var createReactClass = require('create-react-class');


/**
 * @module InlineCss
 */
var InlineCss = createReactClass({
	displayName: "InlineCss",
	propTypes: {
		namespace:     PropTypes.string,
		componentName: PropTypes.string,
		stylesheet:    PropTypes.string.isRequired,
		className:     PropTypes.string,
		wrapper:       PropTypes.string
	},
	_transformSheet: function (stylesheet, componentName, namespace) {
		return stylesheet.
			// Prettier output.
			replace(/}\s*/ig, '\n}\n').
			// Regular rules are namespaced.
			replace(
				/(^|{|}|;|,)\s*([&a-z0-9\-~_=\.:#^\|\(\)\[\]\$'",>*\s]+)\s*(\{)/ig,
				function (matched) {
					return matched.replace(new RegExp(componentName, "g"), "#" + namespace);
				}
			);
	},
	render: function () {
		if(this.props.counter){
			refCounter = parseInt(this.props.counter);	
		}
		var namespace     = this.props.namespace || "InlineCss-" + refCounter++;
		var componentName = this.props.componentName || "&";
		var stylesheet    = this._transformSheet(this.props.stylesheet, componentName, namespace);
		var Wrapper       = this.props.wrapper || "div";

		var wrapperProps = assign({}, this.props, {
			id: namespace
		});

		delete wrapperProps.namespace;
		delete wrapperProps.componentName;
		delete wrapperProps.stylesheet;
		delete wrapperProps.wrapper;
		delete wrapperProps.counter;

		return React.createElement(
			Wrapper,
			wrapperProps,
			this.props.children,
			React.createElement("style", {
				scoped:                  true,
				dangerouslySetInnerHTML: {__html: stylesheet}
			})
		);
	}
});

module.exports = InlineCss;
