import { Link } from '@/navigation';

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', padding: '4rem' }}>
      <h1>404 - Page Not Found</h1>
      <p>Oops! The page you are looking for does not exist...</p>
      <Link href="/" style={{ color: 'var(--color-primary)' }}>
        Go back to the homepage
      </Link>
    </div>
  );
}
