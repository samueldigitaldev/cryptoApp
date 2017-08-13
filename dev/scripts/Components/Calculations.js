import React from 'react';

export default class Calculations extends React.Component{
	constructor() {
		super();

	}
	render() {
	var bitfinexPairs = ["BTCUSD", "LTCUSD", "LTCBTC", "ETHUSD", "ETHBTC", "ETCUSD", "ETCBTC", "BFXUSD", "BFXBTC", "RRTUSD", "RRTBTC", "ZECUSD", "ZECBTC"]

		var currencyPair = [];
		var currencyId = [];
		var currencyObject = {};
		var currencyInfoObject = {};
		var counter = 0;
		var ws = new WebSocket("wss://api.bitfinex.com/ws");

/*CALL WEBSOCKET*/
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

/*END OF CALL WEBSOCKET*/

/*PUSH TICKER INFORMATION INTO OBJECTS AND ARRAYS*/

	    	for (var i = 0; i < currencyPair.length; i++) {
			    currencyObject[currencyId[i]] = currencyPair[i]
			}

			if(response[0] in currencyObject){
				var currencyName = currencyObject[response[0]];
				var askRate = response[3];
				var lastTrade = response[7];
				var bidRate = response[1];
				currencyInfoObject[currencyName] = [bidRate, lastTrade, askRate];
/*END OF PUSH TICKER INFORMATION INTO OBJECTS AND ARRAYS*/

/*CALCULATION OF ARBITRAGE*/


				var currencyInfoArray = Object.keys(currencyInfoObject).map(function(key) {
				  return [currencyInfoObject[key]];
				});

				var bidAskDifferenceArray = [];
				var currencyInfoObjectKeys = Object.keys(currencyInfoObject);

				for(var i = 0; i < currencyInfoObjectKeys.length; i++){

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

/*START OF TRADING PAIR OPTIONS*/
				
			var tradePairOne = document.getElementById("tradePairOne");
			var tradePairTwo = document.getElementById("tradePairTwo");
			var tradePairThree = document.getElementById("tradePairThree");
			var tradePairOneSelected = tradePairOne.value;
			var tradePairTwoSelected = tradePairTwo.value;
			var tradePairThreeSelected = tradePairThree.value;
			
			tradePairOne.addEventListener("change", function(){
				tradePairOneSelected = this.value;
				
			for (var i = 1; i < tradePairOne.options.length; i++){

				var tradePairTwoOptions = tradePairOne.options[i].value;
				var matchStringPairOne = tradePairOneSelected.substring(0,3);
				var matchStringPairTwo = tradePairOneSelected.substring(3,6);

				var matchStringIndexOne = tradePairTwoOptions.indexOf(matchStringPairOne);
				var matchStringIndexTwo = tradePairTwoOptions.indexOf(matchStringPairTwo);

				if (matchStringIndexOne === -1 && matchStringIndexTwo === -1){
					tradePairTwo.options[i].style.display="none";
					tradePairThree.options[i].style.display="none";
					}

					for (var index = 1; index < tradePairTwo.options.length; index++){
						if (tradePairOneSelected === tradePairTwo.options[index].value){
						tradePairTwo.options[index].style.display="none";
						tradePairThree.options[index].style.display="none";

					}
				}
			}
		});

			tradePairTwo.addEventListener("change", function(){

				tradePairTwoSelected = this.value;

				for (var i = 1; i < tradePairOne.options.length; i++){

					var tradePairThreeOptions = tradePairTwo.options[i].value;
					
					var pairOneSubstringOne = tradePairOneSelected.substring(0,3);
					var pairOneSubstringTwo = tradePairOneSelected.substring(3,6);

					var pairTwoSubstringOne = tradePairTwoSelected.substring(0,3);
					var pairTwoSubstringTwo = tradePairTwoSelected.substring(3,6);

					var noMatchArray = [];

					if(pairOneSubstringOne === pairTwoSubstringOne){
						noMatchArray.push(pairTwoSubstringTwo);
					}
					if(pairOneSubstringOne === pairTwoSubstringTwo){
						noMatchArray.push(pairTwoSubstringOne);
					}
					if(pairOneSubstringTwo === pairTwoSubstringOne){
						noMatchArray.push(pairTwoSubstringTwo);
					}
					if(pairOneSubstringTwo === pairTwoSubstringTwo){
						noMatchArray.push(pairTwoSubstringOne);
					}

					for (var arrayIndex = 1; arrayIndex < tradePairThree.options.length; arrayIndex++){
						
						noMatchArray.toString();
						var matchInTradePairThree = tradePairThree.options[arrayIndex].value.indexOf(noMatchArray);
			

						if (matchInTradePairThree < 0){
						tradePairThree.options[arrayIndex].style.display="none";

					}

					for (var index = 1; index < tradePairThree.options.length; index++){
							if (tradePairTwoSelected === tradePairThree.options[index].value){
							tradePairThree.options[index].style.display="none";
						}
					}
				}
			}
		});

		

			tradePairThree.addEventListener("change", function(){
				tradePairThreeSelected = this.value;

			});

			if(tradePairOneSelected !== "Select"){
				tradePairTwo.disabled = false;
				tradePairThree.disabled = true;
			}

			if(tradePairTwoSelected !== "Select"){
				tradePairTwo.disabled = false;
				tradePairThree.disabled = false;
			}

			if(tradePairOneSelected === "Select" && (tradePairTwoSelected !== "Select" || tradePairThreeSelected !=="Select")){
				tradePairTwo.disabled = true;
				tradePairThree.disabled = true;
			}

/*END OF TRADING PAIR OPTIONS*/

/*START OF TRIANGULAR ARBITRAGE*/














/*END OF TRIANGULAR ARBITRAGE*/


/*END OF CALCULATION OF ARBITRAGE*/

/*DETERMINE PROFITABILITY*/


				var profitabilityNode = document.getElementById("profitOrLoss");
				var arbitrageCalculationNode = document.getElementById("highestBidAskDifference");
				arbitrageCalculationNode.innerHTML = highestBidAskDifference;

					if(highestBidAskDifference <= 0){
						profitabilityNode.innerHTML = "Not Profitable";
						profitabilityNode.className = "notProfitable";
						arbitrageCalculationNode.className = "notProfitable";
						highestArbitrageNode.className = "notProfitable";

					}
					else{
						profitabilityNode.innerHTML = "Profitable";
						profitabilityNode.className = "profitable";
						arbitrageCalculationNode.className = "profitable";
						highestArbitrageNode.className = "profitable";
						alert("THIS IS PROFITABLE?!?!");

					}
/*END OF DETERMINE PROFITABILITY*/
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
					<p>Select Your Trade Pairs</p>
					<select id="tradePairOne">
				        <option value="Select">Select A Trade Pair</option>
				        <option value="BTCUSD">BTCUSD</option>
				        <option value="LTCUSD">LTCUSD</option>
				        <option value="LTCBTC">LTCBTC</option>
				        <option value="ETHUSD">ETHUSD</option>
				        <option value="ETHBTC">ETHBTC</option>        
				        <option value="ETCUSD">ETCUSD</option>        
				        <option value="ETCBTC">ETCBTC</option>
				        <option value="BFXUSD">BFXUSD</option>
				        <option value="RRTUSD">RRTUSD</option>
				        <option value="RRTBTC">RRTBTC</option>
				        <option value="ZECUSD">ZECUSD</option>
				        <option value="ZECBTC">ZECBTC</option>
      				</select>

      				<select id="tradePairTwo" disabled="true">
      					<option value="Select">Select A Trade Pair</option>
				        <option value="BTCUSD">BTCUSD</option>
				        <option value="LTCUSD">LTCUSD</option>
				        <option value="LTCBTC">LTCBTC</option>
				        <option value="ETHUSD">ETHUSD</option>
				        <option value="ETHBTC">ETHBTC</option>        
				        <option value="ETCUSD">ETCUSD</option>        
				        <option value="ETCBTC">ETCBTC</option>
				        <option value="BFXUSD">BFXUSD</option>
				        <option value="RRTUSD">RRTUSD</option>
				        <option value="RRTBTC">RRTBTC</option>
				        <option value="ZECUSD">ZECUSD</option>
				        <option value="ZECBTC">ZECBTC</option>
      				</select>

      				<select id="tradePairThree" disabled="true">
      					<option value="Select">Select A Trade Pair</option>
				        <option value="BTCUSD">BTCUSD</option>
				        <option value="LTCUSD">LTCUSD</option>
				        <option value="LTCBTC">LTCBTC</option>
				        <option value="ETHUSD">ETHUSD</option>
				        <option value="ETHBTC">ETHBTC</option>        
				        <option value="ETCUSD">ETCUSD</option>        
				        <option value="ETCBTC">ETCBTC</option>
				        <option value="BFXUSD">BFXUSD</option>
				        <option value="RRTUSD">RRTUSD</option>
				        <option value="RRTBTC">RRTBTC</option>
				        <option value="ZECUSD">ZECUSD</option>
				        <option value="ZECBTC">ZECBTC</option>
      				</select>
			</div>
			
		);
	}
}