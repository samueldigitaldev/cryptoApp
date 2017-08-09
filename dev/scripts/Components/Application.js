import React from 'react';

var bitfinexPairs = ["BTCUSD", "LTCUSD", "LTCBTC", "ETHUSD", "ETHBTC", "ETCUSD", "ETCBTC", "BFXUSD", "BFXBTC", "RRTUSD", "RRTBTC", "ZECUSD", "ZECBTC"];

var node = document.createElement("div");

export default class Application extends React.Component{
  constructor(){
    super();

  }

  callApi(){
    var ws = new WebSocket("wss://api.bitfinex.com/ws");
        console.log(bitfinexPairs[0]);
    ws.onopen = function(){
      ws.send(JSON.stringify({"event":"subscribe", "channel":"ticker", "pair":bitfinexPairs[0]}))

    };

    ws.onmessage = function(msg){
      var response = JSON.parse(msg.data);
      var hb = response[1];
      if(hb !== "hb"){
          node.innerHTML = "ASK: " + response[3] + "<br> LAST: " + response[7] + "<br> BID: " + response[1] ;

          document.getElementById("app").appendChild(node);
          
            }
        };
    }
  
  render() {
    return(
    <div className="widget">
      <div onClick={() => this.callApi()}>
        Click here to call API 
      </div>
    </div>
    );
  }
}