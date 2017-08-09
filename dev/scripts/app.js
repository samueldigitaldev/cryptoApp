import React from 'react';
import ReactDOM from 'react-dom';
import Header from "./Components/Header";
import Application from "./Components/Application"
import Footer from "./Components/Footer";

var bitfinexPairs = ["BTCUSD", "LTCUSD", "LTCBTC", "ETHUSD", "ETHBTC", "ETCUSD", "ETCBTC", "BFXUSD", "BFXBTC", "RRTUSD", "RRTBTC", "ZECUSD", "ZECBTC"]

	var node = document.createElement("div");
	var ws = new WebSocket("wss://api.bitfinex.com/ws");

	
	ws.onopen = function(){
	  ws.send(JSON.stringify({"event":"subscribe", "channel":"ticker", "pair":bitfinexPairs[0]}))
	};

	ws.onmessage = function(msg){
	  var response = JSON.parse(msg.data);
	  var hb = response[1];
	  if(hb !== "hb"){
	      node.innerHTML = "ASK: " + response[3] + "<br> LAST: " + response[7] + "<br> BID: " + response[1];

	      document.getElementById("app").appendChild(node);
	      
	        }
	    };

class Parameters extends React.Component{
    constructor() {
        super();
      
    }

    render() {
        return (
            <div>
            	<div className="widget">

			    </div>
                <ul>
 
                </ul>
            </div>
        )
    }

}


ReactDOM.render(<Header />, document.getElementById('header'));
ReactDOM.render(<Parameters />, document.getElementById('parameters'));

ReactDOM.render(<Footer />, document.getElementById('footer'));



