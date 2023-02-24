import Grediit from './grediit.png';
import Logout from './Logout';
import { Link } from 'react-router-dom';











export default function Navbar(props) {

  function Extras()
  {
    return(
      <>
        <button className="normal-case text-xl btn m-2" onClick={()=>(props.mode[1]("home"))}>Home</button>
        <button className="normal-case text-xl btn m-2" onClick={()=>(props.mode[1]("users"))}>Users</button>
        <button className="normal-case text-xl btn m-2" onClick={()=>(props.mode[1]("requests"))}>Requests</button>
      </>
    )
  }




  return (

    <div className="navbar bg-purple-50">
      <div className="navbar-start">
        <Link to="/" className="btn btn-ghost">
          <p className="normal-case text-xl">Greddiitr</p>
          <img className="aspect-square h-12 ml-2" src={Grediit}></img>
        </Link>
      </div>
      <div className='navbar-center'>
        <Link to="/mysubG" className='btn btn-ghost'>
          <p className="normal-case text-xl">MySubG</p>
        </Link>
        <Link to="/allSubgs" className='btn btn-ghost'>
          <p className="normal-case text-xl">AllSubGs</p>
        </Link>
        {props.condRender && <Extras />}
      </div>
      <div className="navbar-end">
        <Logout />
      </div>
    </div>
  );
}
