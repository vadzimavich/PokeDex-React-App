import { Link, Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div className="app">
      <nav
        style={{ padding: '1rem', textAlign: 'center', background: '#2c2c2c' }}
      >
        <Link to="/" style={{ marginRight: '1.5rem', color: 'white' }}>
          Home
        </Link>
        <Link to="/about" style={{ color: 'white' }}>
          About
        </Link>
      </nav>
      <main>
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
