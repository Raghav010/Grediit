import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authUser from './authenticateUser';
import Grediit from './grediit.png'


// this component takes up the entire width and height of the container

function Login()
{
    const [usernameP,setUsernameP]=useState(false);
    const [passP,setPassP]=useState(false);
    const [loginColor,setLoginColor]=useState("");
    const [eMessage,setEMessage]=useState("");
    const [loading,setLoading]=useState("");
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

    function showProcessing()
    {
        setLoading("loading");
    }


    // do server side validation here
    // validating the user password and username
    async function validate(e)
    {
        e.preventDefault();
        showProcessing();
    
        // redirect to profile and set localstorage
        const authed=await authUser(e.target[0].value,e.target[1].value);
        //console.log(authed);
        if(authed)
        {
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
        <div className="bg-purple-900 shadow-2xl rounded-xl h-full w-full flex flex-row justify-center items-center p-4">
            <div className="flex flex-col justify-center items-center w-2/3">
                <h1 className="text-white font-bold text-4xl pb-10 w-fit max-w-full">Login</h1>
                <form onSubmit={validate} className="form-control">
                    <input className="input input-ghost bg-purple-900 text-white focus:bg-white w-full max-w-full" type="text" placeholder="Username" onChange={e=>Enable(e,"username")}></input>
                    <div className="divider"></div>
                    <input className="input input-ghost bg-purple-900 text-white focus:bg-white w-full max-w-full" type="password" placeholder="Password" onChange={e=>Enable(e,"pass")} minLength="5"></input>
                    <button className={"btn btn-active mt-4"+loginColor +" w-full max-w-full h-fit max-h-full " + loading} disabled={!(usernameP && passP)}>Login {eMessage}</button>
                </form>
            </div>
            <div className="divider divider-horizontal"></div>
            <div className="flex flex-col self-start justify-evenly h-full items-center w-1/3">
                
                <img className="aspect-square w-3/4" src={Grediit}></img>
                <h1 className="text-3xl font-bold text-white w-fit max-w-full">Grediit</h1>
            </div>
        </div>
    );
}


export default Login;