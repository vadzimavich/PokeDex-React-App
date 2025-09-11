import { Link } from 'react-router-dom';

const AboutPage = () => {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>About Pokedex</h1>
      <p>This application was created by @vadzimavich.</p>
      <p>
        It&apos;s a learning project for the{' '}
        <a
          href="https://rs.school/courses/reactjs"
          target="_blank"
          rel="noopener noreferrer"
        >
          RS School React Course
        </a>
        .
      </p>
      <Link to="/">Back to Home</Link>
    </div>
  );
};

export default AboutPage;
