import { Component } from 'react';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import './App.css';

class App extends Component {
  render() {
    return (
      <ErrorBoundary>
        <div className="app">
          <Header />
          <Main />
        </div>
      </ErrorBoundary>
    );
  }
}

export default App;
