import React, { Component } from 'react';
import { Route, Switch, HashRouter as Router } from 'react-router-dom'

import './App.css';

import ProductDetails from './components/ProductDetails'
import MainScreen from './components/MainScreen';

class App extends Component {
  render() {
    return (
      <Router onUpdate={() => window.scrollTo(0, 0)}>
        <div className="App">
          <Switch>
            <Route exact path="/" component={MainScreen} />
            <Route path="/product/:sku" component={ProductDetails} />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
