import React from 'react';
import logo from './logo.svg';
import './App.css';
import { WebSocketSrv } from './services';
import { GameCommands } from './services/websocket.service';

class App extends React.Component {

  componentWillMount() {
    WebSocketSrv.sendCommand(GameCommands.help);
    WebSocketSrv.sendCommand(GameCommands.new, 1);
    WebSocketSrv.sendCommand(GameCommands.map);
    WebSocketSrv.sendCommand(GameCommands.open, '0 0');
    WebSocketSrv.sendCommand(GameCommands.map);
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.tsx</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>
      </div>
    );
  }
  
}

export default App;

/*
class Ws {
  get newClientPromise() {
    return new Promise((resolve, reject) => {
      let wsClient = new WebSocket("ws://demos.kaazing.com/echo");
      console.log(wsClient)
      wsClient.onopen = () => {
        console.log("connected");
        resolve(wsClient);
      };
      wsClient.onerror = error => reject(error);
    })
  }
  get clientPromise() {
    if (!this.promise) {
      this.promise = this.newClientPromise
    }
    return this.promise;
  }
}

window.wsSingleton = new Ws()

window.wsSingleton.clientPromise
  .then( wsClient =>{wsClient.send('data'); console.log('sended')})
  .catch( error => alert(error) )

*/
