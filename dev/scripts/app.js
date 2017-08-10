import React from 'react';
import ReactDOM from 'react-dom';
import Header from "./Components/Header";
import Application from "./Components/Application"



class Parameters extends React.Component{
    constructor() {
        super();
      
    }

    render() {

	var bitfinexPairs = ["BTCUSD", "LTCUSD", "LTCBTC", "ETHUSD", "ETHBTC", "ETCUSD", "ETCBTC", "BFXUSD", "BFXBTC", "RRTUSD", "RRTBTC", "ZECUSD", "ZECBTC"]

		var currencyPair = [];
		var currencyId = [];
		var currencyObject = {};
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

	        	var tickerInfoNode = document.createElement("div");
	        	var tickerNameNode = document.createElement("div");      

	        	tickerInfoNode.className = "widget" + counter;
				tickerNameNode.innerHTML = currencyPair[counter];
	        	
	        	document.getElementById("widget").appendChild(tickerInfoNode);
	        	document.getElementById("widget").appendChild(tickerNameNode);

	        	counter++;
	        }

	    	for (var i = 0; i < currencyPair.length; i++) {
			    currencyObject[currencyId[i]] = currencyPair[i]
			}

			if(response[0] in currencyObject){
				var position = currencyId.indexOf(response[0]);
				var widgetsNode = document.getElementsByClassName("widget"+position);

				var dataNode = document.createElement("div");
				dataNode.innerHTML = "Lowest Ask: " + response[3] + "<br> Last Trade: " + response[7] + "<br> Highest Bid: " + response[1];

				widgetsNode[0].innerHTML = dataNode.innerHTML;
	        	
				}
		    }
		};

        return (
            <div>
            	<div id="widget">

			    </div>

            </div>
        )
    }
}


ReactDOM.render(<Header />, document.getElementById('header'));
ReactDOM.render(<Parameters />, document.getElementById('parameters'));


