import { Component } from 'react';
import Search from '../Search/Search';

interface HeaderProps {
  onSearch: (searchTerm: string) => void;
}

class Header extends Component<HeaderProps> {
  render() {
    return (
      <header className="header">
        {}
        <Search onSearch={this.props.onSearch} />
      </header>
    );
  }
}

export default Header;
