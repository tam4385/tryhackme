import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Search from './pages/Search';
import Hotel from './pages/Hotel';
import Country from './pages/Country';
import City from './pages/City';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Search />} />
        <Route path="/hotels/:id" element={<Hotel />} />
        <Route path="/countries/:id" element={<Country />} />
        <Route path="/cities/:id" element={<City />} />
      </Routes>
    </Router>
  );
}

export default App;