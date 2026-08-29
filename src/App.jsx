import { Routes, Route } from 'react-router-dom';
import MainLayout from './layouts/MainLayout.jsx';
import Home from './pages/Home/Home.jsx';
import Playground from './pages/Playground/Playground.jsx';
import Projects from './pages/Projects/Projects.jsx';
import Challenges from './pages/Challenges/Challenges.jsx';
import Learn from './pages/Learn/Learn.jsx';

export default function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/playground" element={<Playground />} />
        <Route path="/playground/:projectId" element={<Playground />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/challenges" element={<Challenges />} />
        <Route path="/learn" element={<Learn />} />
        <Route path="*" element={<Home />} />
      </Route>
    </Routes>
  );
}
