import logo from './logo.svg';
import './App.css';
import Books from './components/Books';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  
  return (
    <div className="App">
     
     <Router>
        
        <Routes>
        
          <Route path="/" element={<Books/>} />
        
        </Routes>
      </Router>
    </div>
  );
}

export default App;
