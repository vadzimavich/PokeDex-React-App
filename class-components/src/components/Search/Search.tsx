import { Component } from 'react';

interface SearchProps {
  onSearch: (searchTerm: string) => void;
}

interface SearchState {
  inputValue: string;
}

class Search extends Component<SearchProps, SearchState> {
  constructor(props: SearchProps) {
    super(props);
    this.state = {
      inputValue: '',
    };
  }

  handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ inputValue: event.target.value });
  };

  handleSearchClick = () => {
    this.props.onSearch(this.state.inputValue.trim());
  };

  render() {
    return (
      <div className="search-container">
        <input
          type="text"
          className="search-input"
          placeholder="Search..."
          value={this.state.inputValue}
          onChange={this.handleInputChange}
        />
        <button className="search-button" onClick={this.handleSearchClick}>
          Search
        </button>
      </div>
    );
  }
}

export default Search;
