import React from 'react';

export default class Header extends React.Component{
	constructor() {
		super();
		this.name = "Cryptocurrency API Project";

	}
	render() {
		return(
			<div>
				<h1>Bitfinex {this.name}</h1>
				<p>Ticker Information of Trade Pairs</p>
			</div>
			
		);
	}
}