import React from 'react';
import Sidebar from './Sidebar';
import './App.css';
import './inventory.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  return (
    <div className="App">
      <Sidebar/>
      {/* <Inventory /> */}
    </div>
  );
};

export default App;
