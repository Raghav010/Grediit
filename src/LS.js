import Login from './Login'
import Register from './Register'
import { useState,useEffect} from 'react'
import Loading from './Loading';
import { useNavigate } from 'react-router-dom';

export default function LS()
{
    const [mode,setMode]=useState("Login");
    const [loggedin,setLoggedin]=useState(true);
    const navigate=useNavigate();

    // redirect directly to profile if logged in, server side validation
    useEffect(()=>{
        if (localStorage.getItem("username") != null) {
            navigate('/profile/'+localStorage.getItem("username"));
        }
        else
        {
            setLoggedin(false);
        }
    },[navigate,setLoggedin]);

    if(loggedin==true) // shows loading screen while server side authorization occurs
    {
        return <Loading />;
    }


    let modeDisplay;
    if(mode=="Login")
    {
        modeDisplay=<Login />
    }
    else if(mode=="Register")
    {
        modeDisplay=<Register />
    }

    return (
        <div className="flex flex-col items-center justify-center h-screen w-screen bg-gradient-to-br from-gray-800 to-purple-300">
            <div className="btn-group grid grid-cols-2 m-6">
                <button className="btn btn-outline btn-secondary text-xl font-extrabold" onClick={()=>(setMode("Login"))}>Login</button>
                <button className="btn btn-outline btn-accent text-xl font-extrabold" onClick={()=>(setMode("Register"))}>Register</button>
            </div>
            {modeDisplay}
        </div>
    );
}