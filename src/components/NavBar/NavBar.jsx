import { Link } from 'react-router-dom';
import * as userService from '../../utilities/users-service';
import './NavBar.css'; // Import the CSS file for the navbar

export default function NavBar({ user, setUser }) {
  function handleLogOut() {
    userService.logOut();
    setUser(null);
  }

  return (
    <nav className="navbar">
      <span className="navbar-user">Welcome, {user.name}</span>
      <Link to="" onClick={handleLogOut} className="navbar-link navbar-logout">Log Out</Link>
    </nav>
  );
}
