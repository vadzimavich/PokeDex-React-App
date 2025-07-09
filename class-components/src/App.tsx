import { Component } from 'react';
import Header from './components/Header/Header';
import Main from './components/Main/Main';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import './App.css';

interface AppState {
  searchTerm: string;
}

class App extends Component<object, AppState> {
  constructor(props: object) {
    super(props);
    this.state = {
      searchTerm: '',
    };
  }

  handleSearch = (term: string) => {
    this.setState({ searchTerm: term });
  };

  render() {
    return (
      <ErrorBoundary>
        <div className="app">
          <Header onSearch={this.handleSearch} />
          <Main />
        </div>
      </ErrorBoundary>
    );
  }
}

export default App;
