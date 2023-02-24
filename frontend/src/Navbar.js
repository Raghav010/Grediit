import Grediit from './grediit.png';
import Logout from './Logout';
import { Link } from 'react-router-dom';



export default function Navbar() {
  return (

    <div className="navbar bg-purple-50">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost">
          <p className="normal-case text-xl">Greddiitr</p>
          <img className="aspect-square h-12 ml-2" src={Grediit}></img>
        </Link>
      </div>
      <div className="navbar-end">
        <Logout />
      </div>
    </div>
  );
}
