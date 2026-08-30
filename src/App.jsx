import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import MainLayout from './layouts/MainLayout.jsx';
import Home from './pages/Home/Home.jsx';
import Playground from './pages/Playground/Playground.jsx';
import Projects from './pages/Projects/Projects.jsx';
import Challenges from './pages/Challenges/Challenges.jsx';
import Learn from './pages/Learn/Learn.jsx';
import Login from './pages/Login/Login.jsx';
import Register from './pages/Register/Register.jsx';
import Profile from './pages/Profile/Profile.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';

export default function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/challenges" element={<Challenges />} />
          <Route path="/learn" element={<Learn />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

          {/* Protected Routes */}
          <Route
            path="/playground"
            element={
              <ProtectedRoute>
                <Playground />
              </ProtectedRoute>
            }
          />
          <Route
            path="/playground/:projectId"
            element={
              <ProtectedRoute>
                <Playground />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <Projects />
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Home />} />
        </Route>
      </Routes>
    </AuthProvider>
    </ThemeProvider>
  );
}
