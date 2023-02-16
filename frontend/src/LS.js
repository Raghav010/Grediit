import Login from './Login'
import Register from './Register'
import { useState,useEffect} from 'react'
import Loading from './Loading';
import { useNavigate } from 'react-router-dom';
import authUser from './authenticateUser';

export default function LS()
{
    const [mode,setMode]=useState("Login");
    const [loggedin,setLoggedin]=useState(true);
    const navigate=useNavigate();

    // redirect directly to profile if logged in, server side validation
    useEffect(()=>{
        const auth=async ()=>{

            const authed = await fetch('/api/auth', {
                method: 'GET',
                headers: {
                    'x-auth-token': localStorage.getItem('jwtToken')
                }
            });

            //console.log(authed);
            if (authed.ok) {
                const data=await authed.json();
                navigate('/profile/'+data.username);
            }
            else
            {
                setLoggedin(false);
            }
        };
        auth();
    },[]);

    if(loggedin==true) // shows loading screen while server side authorization occurs
    {
        return <Loading />;
    }


    let modeDisplay;
    if(mode=="Login")
    {
        modeDisplay=<div className="h-1/2 w-4/5 lg:w-1/3"><Login /></div>
    }
    else if(mode=="Register")
    {
        modeDisplay=<div className="h-full lg:w-1/3 w-4/5"><Register changeMode={setMode}/></div>
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