import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Search from './search';

const Header = ({ title, search, setSearch, search_album, playlist, currentTrack }) => {
  const [menuVisible, setMenuVisible] = useState(false);

  // Function to toggle the menu visibility
  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };
  const hideMenu = () => {
    setMenuVisible(false);
  };

  return (
    <div className="header" onMouseLeave={hideMenu}>
      <div>
      <div className="header-left">
        <button className="menu-button" onClick={toggleMenu}>
          ☰ {/* Hamburger icon */}
        </button>
        <Link to="/" className="header-link">
          {title}
        </Link>
      </div>
      <div style={{background:'#00e600'}} className={`header-menu ${menuVisible ? 'visible' : ''}`}>
        <Link style={{marginTop:'10px'}}  to="/playlist" className="header-link">
          Playlist
        </Link>
        <Link to="/login" className="header-link">
          Login
        </Link>
        <Link to="/signup" className="header-link">
          Signup
        </Link>
        <Link style={{marginBottom:'10px'}} to="/rooms" className="header-link">
          Rooms
        </Link>
      </div>

      </div>

      <div>
      <Search className="" search={search} setSearch={setSearch} search_album={search_album} />
      </div>
      

      


      <style jsx>{`
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          background-color: #1DB954;
          color: #ffffff;
          position: sticky;
          top: 0;
          z-index: 1;
        }

        .header-left {
          display: flex;
          align-items: center;
          margin-top: -0.25rem;
          justify-content: start;
        }

        .menu-button {
          font-size: 24px;
          background: none;
          border: none;
          color: #ffffff;
          cursor: pointer;
          margin-right: -1rem;
          margin-top: -0.25rem;
        }

        .header-link {
          color: white;
          text-decoration: none;
          margin-left: 2rem;
        }
        .header-link:hover{
          background-color: #f0f0f0; /* Change background color on hover */
          color: #0078d4;
          border-radius: 5px;
          padding: 5px;
        }

        /* Hide the menu items by default */
        .header-menu {
          display: none;
        }

        /* Show the menu items when the menuVisible state is true */
        .header-menu.visible {
          margin-top: -0.25rem;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          position: absolute;
          top: 64px; /* Adjust this value as needed */
          left: 0;
          background-color: #1DB954;
          width: 100%;
          gap:4px;
          font-size: 14px;
        }

        /* Media query to show/hide menu items */
        @media (max-width: 500px) {
          .header-menu {
            display: ${menuVisible ? 'flex' : 'none'};
            flex-direction: column;
            align-items: flex-start;
            position: absolute;
            top: 64px; /* Adjust this value as needed */
            left: 0;
            background-color: #1DB954;
            width: 100%;
          }
        }
        @media (max-width: 396px) {
          .header-left {
            margin-left: -8rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Header;
