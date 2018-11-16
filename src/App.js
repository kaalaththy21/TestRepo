import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import logo from './logo.svg';
import './App.css';
import SimpleNavigationHelper from './simple-navigation-helper';

declare var MozActivity;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      items: ['Call', 'SMS']
    }
  }

  componentDidMount() {
    this.FOCUS_SELECTOR = '.list-item';
    this.element = ReactDOM.findDOMNode(this);
    this.navigator = new SimpleNavigationHelper(this.FOCUS_SELECTOR, this.element);
    this.refs.list.focus();
  }

  onFocus() {
    if (document.activeElement === this.element) {
      ReactDOM.findDOMNode(this.refs.list).focus();
    }
  }

  handleClick(position)
  {
    switch(position)
    {
      case "0":

      new MozActivity({
                name: "dial",
                data: {
                    number: "+911234567890"
                }
                //dial.hangUp();
            });
    /*  {alert("Call button Click");}*/

      break;

      case "1":

      new MozActivity({
                name: "new", // Possible compose-sms in future versions
                data: {
                    type: "websms/sms",
                    number: "+911234567890",
                    body:"KAIOS"
                    
                }
            });

      break;
    }

  }

  onKeyDown(evt) {
    switch (evt.key) {
      case 'Enter':
        console.log("Center soft key(CSK) is pressed");
        console.log(evt.target.dataset.index + " Pressed item is ", evt.target.dataset.name);
        {this.handleClick(evt.target.dataset.index);}
        break;
    }
  }
 

  render() {

    let dom = [];
    this.state.items.map(function (item, index) {
      dom.push(
        <p tabIndex="-1" className="list-item" data-index={index} data-name={item}>{item}</p>
      );
    });

    return (
      <div ref="list" tabIndex="-1" className="App" onFocus={() => this.onFocus()} onKeyDown={(e) => this.onKeyDown(e)}>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          {dom}
        </p>
      </div>
    );
  }
}

export default App;
