import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.scss'
import Header from './components/Header/Header';
import Home from './pages/Home';
import Editing from './pages/Editing';
import ScrollToTop from './components/ScrollToTop/ScrollToTop';

const normalizeBasename = (baseUrl: string) => {
  if (!baseUrl || baseUrl === './' || baseUrl === '/./') {
    return '/';
  }

  let normalized = baseUrl.startsWith('/') ? baseUrl : `/${baseUrl}`;
  normalized = normalized.replace(/\/\.\//g, '/').replace(/\/+/g, '/');

  if (normalized.length > 1 && normalized.endsWith('/')) {
    normalized = normalized.slice(0, -1);
  }

  return normalized;
};

const inferBasenameFromPathname = (pathname: string) => {
  if (pathname === '/kitchen' || pathname.startsWith('/kitchen/')) {
    return '/kitchen';
  }

  return '/';
};

const resolvedBase = normalizeBasename(import.meta.env.BASE_URL);
const routerBasename = resolvedBase !== '/'
  ? resolvedBase
  : inferBasenameFromPathname(window.location.pathname);

function App() {
  return (
    <Router basename={routerBasename}>
      <div className="appContainer">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/editing" element={<Editing />} />
        </Routes>
        <ScrollToTop />
      </div>
    </Router>
  )
}

export default App
