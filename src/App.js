import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SearchPage from './components/SearchPage';
import ResultsPage from './components/ResultsPage';
import './index.css';

const App = () => {
    return (
        <Router>
            <div className="App bg-purple-200 min-h-screen text-white">
                <Routes>
                    <Route path="/search/:address" element={<ResultsPage />} />
                    <Route path="/search" element={<SearchPage />} />
                    <Route path="/" element={<SearchPage />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
