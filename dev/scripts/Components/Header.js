import React from 'react';

export default class Header extends React.Component{
	constructor() {
		super();
		this.name = "Cryptocurrency API Project";
		this.profit = "placeholder";

	}
	render() {
		return(
			<div>
				<h1>Bitfinex {this.name}</h1>
				<p>Opportunity for Profit/Loss: {this.profit}</p>
			</div>
			
		);
	}
}