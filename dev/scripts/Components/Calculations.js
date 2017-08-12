import React from 'react';

export default class Calculations extends React.Component{
	constructor() {
		super();
		this.profit = "10";


	}
	render() {
	var bitfinexPairs = ["BTCUSD", "LTCUSD", "LTCBTC", "ETHUSD", "ETHBTC", "ETCUSD", "ETCBTC", "BFXUSD", "BFXBTC", "RRTUSD", "RRTBTC", "ZECUSD", "ZECBTC"]

		var currencyPair = [];
		var currencyId = [];
		var currencyObject = {};
		var currencyInfoObject = {};
		var counter = 0;
		var ws = new WebSocket("wss://api.bitfinex.com/ws");

		ws.onopen = () => {
			for(var i = 0; i < bitfinexPairs.length; i++){
				ws.send(JSON.stringify(
			  		{
				  	"event":"subscribe",
				  	"channel":"ticker",
				  	"pair":bitfinexPairs[i]
			  		})
				)
			}
		}

		ws.onmessage = function(msg){
		  var response = JSON.parse(msg.data);
		  var hb = response[1];
		  if(hb !== "hb"){

	        if(response.event === "subscribed"){
	        	currencyPair.push(response.pair);
	        	currencyId.push(response.chanId);    
	        	counter++;
	        }

	    	for (var i = 0; i < currencyPair.length; i++) {
			    currencyObject[currencyId[i]] = currencyPair[i]
			}

			if(response[0] in currencyObject){
				var currencyName = currencyObject[response[0]];
				var askRate = response[3];
				var lastTrade = response[7];
				var bidRate = response[1];
				currencyInfoObject[currencyName] = [bidRate, lastTrade, askRate];

	
				var currencyInfoArray = Object.keys(currencyInfoObject).map(function(key) {
				  return [currencyInfoObject[key]];
				});



				var bidAskDifferenceArray = [];
				var currencyInfoObjectKeys = Object.keys(currencyInfoObject);

				for(var i = 0; i < currencyInfoObjectKeys.length; i++){
					//get the object grab array #1 and find difference and then push into a new array. Finally, find the max difference

					var bidAskDifference = currencyInfoArray[i][0][0] - currencyInfoArray[i][0][2];
					
					bidAskDifferenceArray.push(bidAskDifference);

					if (i === Object.keys(currencyInfoObject).length -1){

						var highestBidAskDifference = bidAskDifferenceArray.reduce(function(a,b){
							return Math.max(a,b);
						});

						var bidAskDifferenceIndex = bidAskDifferenceArray.indexOf(highestBidAskDifference);

						var highestArbitrageTicker = currencyInfoObjectKeys[bidAskDifferenceIndex];

						var highestArbitrageNode = document.getElementById("arbitrageTicker");

						highestArbitrageNode.innerHTML = highestArbitrageTicker;

					}

				}

				var profitabilityNode = document.getElementById("profitOrLoss");

				var arbitrageCalculationNode = document.getElementById("highestBidAskDifference");
				arbitrageCalculationNode.innerHTML = highestBidAskDifference;


					if(highestBidAskDifference < 0){
						profitabilityNode.innerHTML = "Not Profitable";
						profitabilityNode.className = "notProfitable";
						arbitrageCalculationNode.className = "notProfitable";

					}
					else{
						profitabilityNode.innerHTML = "Profitable";
						profitabilityNode.className = "profitable";
						arbitrageCalculationNode.className = "profitable";
						alert("THIS IS PROFITABLE?!?!");

					}

				}
		    }
		};
	

		return(
			<div>
				<h2>Calculations of Arbitrage</h2>
				<div>
					<div>Opportunity for Profit/Loss:<span> </span>  
						<div id="profitOrLoss"></div>
					</div>
					<div>Ticker With Highest Arbitrage:<span> </span>  
						<div id="arbitrageTicker"></div>
					</div>
					<div>Highest Net Profit/Loss:<span> </span>
						<div id="highestBidAskDifference"></div>
					</div>
				</div>
				<h3>Calculations of Triangular Arbitrage</h3>


			</div>
			
		);
	}
}