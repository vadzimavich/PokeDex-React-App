import { Component } from 'react';

interface State {
  shouldThrow: boolean;
}

class ErrorButton extends Component<object, State> {
  constructor(props: object) {
    super(props);
    this.state = { shouldThrow: false };
  }

  handleClick = () => {
    this.setState({ shouldThrow: true });
  };

  render() {
    if (this.state.shouldThrow) {
      throw new Error('Error from ErrorButton component!');
    }

    return (
      <button
        onClick={this.handleClick}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          padding: '0.5rem 1rem',
          backgroundColor: '#ff6464',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}
      >
        Throw Error
      </button>
    );
  }
}

export default ErrorButton;
