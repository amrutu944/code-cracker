import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar.jsx';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-cc-bg text-cc-text">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
}
