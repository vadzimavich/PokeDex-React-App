import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you are looking for does not exist...</p>
      <Link to="/">Go back to the Home Page</Link>
    </div>
  );
};

export default NotFoundPage;
