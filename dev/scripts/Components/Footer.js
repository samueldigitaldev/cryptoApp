import React from 'react';

export default class Footer extends React.Component{
	constructor() {
		super();
		this.name = "Will";

	}
	render() {
		return(
			<h3>It's {this.name}</h3>
		);
	}
}