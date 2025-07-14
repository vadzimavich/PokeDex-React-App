import { Component } from 'react';
import Search from '../Search/Search';

interface HeaderProps {
  onSearch: (searchTerm: string) => void;
  searchTerm: string;
}

class Header extends Component<HeaderProps> {
  render() {
    return (
      <header className="header">
        <Search
          onSearch={this.props.onSearch}
          initialValue={this.props.searchTerm}
        />
      </header>
    );
  }
}

export default Header;
