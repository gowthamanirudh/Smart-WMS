import React, { useState } from 'react';
import { FaBoxes, FaChartBar, FaInfoCircle,FaBars } from 'react-icons/fa';
import Inventory from './Inventory';

const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [activePage, setActivePage] = useState('inventory');

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <div className="d-flex">
      {/* Sidebar */}
      <div className={`bg-dark text-light ${isOpen ? 'w-25' : 'w-10'} vh-100 p-3`}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h4>{isOpen ? 'Dashboard' : 'DB'}</h4>
          <button className="btn btn-light btn-sm" onClick={toggleSidebar}>
            <FaBars />
          </button>
        </div>

        <ul className="nav flex-column">
          <li className="nav-item">
            <button className="btn btn-dark w-100 text-start" onClick={() => setActivePage('about')}>
              <FaInfoCircle /> {isOpen && 'About'}
            </button>
          </li>
          <li className="nav-item">
            <button className="btn btn-dark w-100 text-start" onClick={() => setActivePage('inventory')}>
              <FaBoxes /> {isOpen && 'Inventory'}
            </button>
          </li>
          <li className="nav-item">
            <button className="btn btn-dark w-100 text-start" onClick={() => setActivePage('dashboard')}>
              <FaChartBar /> {isOpen && 'Dashboard'}
            </button>
          </li>
          {/* <li className="nav-item">
            <button className="btn btn-dark w-100 text-start" onClick={() => setActivePage('about')}>
              <FaInfoCircle /> {isOpen && 'About'}
            </button>
          </li> */}
          {/* <li className="nav-item">
            <button className="btn btn-dark w-100 text-start" onClick={() => setActivePage('services')}>
              <FaTools /> {isOpen && 'Services'}
            </button>
          </li>
          <li className="nav-item">
            <button className="btn btn-dark w-100 text-start" onClick={() => setActivePage('contact')}>
              <FaEnvelope /> {isOpen && 'Contact'}
            </button>
          </li> */}
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow-1 p-4">
        {activePage === 'inventory' && <Inventory />}
        {activePage === 'dashboard' && <h2>📊 Dashboard Coming Soon!</h2>}
        {activePage === 'about' && <h2>ℹ️ About Us</h2>}
        {/* {activePage === 'services' && <h2>🔧 Our Services</h2>}
        {activePage === 'contact' && <h2>📩 Contact Us</h2>} */}
      </div>
    </div>
  );
};

export default Sidebar;
