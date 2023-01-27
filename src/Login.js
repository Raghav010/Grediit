import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grediit from './grediit.png'


// For this component to work it needs a box the size of the screen as its parent

function Login()
{
    const [usernameP,setUsernameP]=useState(false);
    const [passP,setPassP]=useState(false);
    const [loginColor,setLoginColor]=useState("");
    const [eMessage,setEMessage]=useState("");
    const navigate=useNavigate();

    

    // for enabling the login button
    function Enable(e,field){
        if(field=="username")
        {
            setUsernameP((((e.target.value).toString()!=="")?true:false));
        }
        else if(field=="pass")
        {
            setPassP((((e.target.value).toString()!=="")?true:false));
        }
    };


    // do server side validation here
    function validate(e)
    {
        e.preventDefault();
        //console.log(e.target[0].value);
        //console.log(e.target[1].value);
        // redirect to profile and set localstorage
        if(e.target[0].value=="admin" && e.target[1].value=="admin")
        {
            localStorage.setItem('username',e.target[0].value)
            localStorage.setItem('pass',e.target[1].value)
            navigate('/profile/'+e.target[0].value);
            // store username/email local storagw
            // pass it as a param to profile site
        }
        else
        {
            setLoginColor(" btn-error ");
            setEMessage("Wrong username or password!");
        }
    }


    return(
        <div className="bg-purple-900 shadow-2xl rounded-xl h-1/2 w-1/3 flex flex-row justify-center items-center p-4">
            <div className="flex flex-col justify-center items-center w-2/3">
                <h1 className="text-white font-bold text-4xl pb-10">Login</h1>
                <form onSubmit={validate} className="form-control">
                    <input className="input input-ghost bg-purple-900 text-white focus:bg-white" type="text" placeholder="Username" onChange={e=>Enable(e,"username")}></input>
                    <div className="divider"></div>
                    <input className="input input-ghost bg-purple-900 text-white focus:bg-white" type="password" placeholder="Password" onChange={e=>Enable(e,"pass")} minLength="5"></input>
                    <button className={"btn btn-active mt-4"+loginColor} disabled={!(usernameP && passP)}>Login {eMessage}</button>
                </form>
            </div>
            <div className="divider divider-horizontal"></div>
            <div className="flex flex-col self-start justify-evenly h-full items-center w-1/3">
                
                <img className="aspect-square w-3/4" src={Grediit}></img>
                <h1 className="text-4xl font-bold text-white">Grediit</h1>
            </div>
        </div>
    );
}


export default Login;