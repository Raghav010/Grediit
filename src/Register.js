import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grediit from './grediit.png'

// For this component to work it needs a box the size of the screen as its parent

function Register()
{

    const [fieldsP,setFieldsP]=useState(Array(7).fill(false));
    const navigate=useNavigate();

    // for enabling the register button
    function Enable(e, field) {
        let cFieldsP=fieldsP.slice();
        cFieldsP[field]=(((e.target.value).toString() !== "") ? true : false);
        setFieldsP(cFieldsP);
    };

    let enable=true;
    for(let i=0;i<7;i++)
    {
        enable=(enable && fieldsP[i]);
    }

    // redirect to profile page after registering
    function redirect()
    {
        navigate("/profile/admin");
    }

    return (

        <div className="bg-purple-900 shadow-2xl rounded-xl h-4/5 w-1/3 flex flex-row justify-center items-center p-4">
            <div className="flex flex-col justify-center items-center w-2/3">
                <h1 className="text-white font-bold text-4xl pb-10">Register</h1>
                <form className="form-control" onSubmit={redirect}>
                    <input className="input input-ghost text-white bg-purple-900 focus:bg-white" type="text" placeholder="First Name" onChange={e=>Enable(e,0)}></input>
                    <div className="divider"></div>
                    <input className="input input-ghost text-white bg-purple-900 focus:bg-white" type="text" placeholder="Last Name" onChange={e=>Enable(e,1)}></input>
                    <div className="divider"></div>
                    <input className="input input-ghost text-white bg-purple-900 focus:bg-white" type="text" placeholder="Username" onChange={e=>Enable(e,2)}></input>
                    <div className="divider"></div>
                    <input className="input input-ghost text-white bg-purple-900 focus:bg-white" type="email" placeholder="Email" onChange={e=>Enable(e,3)}></input>
                    <div className="divider"></div>
                    <input className="input input-ghost text-white bg-purple-900 focus:bg-white" type="number" placeholder="Age" onChange={e=>Enable(e,4)} min="18"></input>
                    <div className="divider"></div>
                    <input className="input input-ghost text-white bg-purple-900 focus:bg-white" type="tel" placeholder="Phone Number" onChange={e=>Enable(e,5)} maxLength="10" minLength="10"></input>
                    <div className="divider"></div>
                    <input className="input input-ghost text-white bg-purple-900 focus:bg-white" type="password" placeholder="Password" onChange={e=>Enable(e,6)} minLength="5"></input>
                    <button className="btn btn-active mt-4 " disabled={!enable}>Register</button>
                </form>
            </div>
            <div className="divider divider-horizontal"></div>
            <div className="flex flex-col self-start justify-evenly h-full items-center w-1/3">
                <img className="aspect-square w-3/4" src={Grediit}></img>
                <h1 className="text-white font-bold text-4xl">Grediit</h1>
            </div>
        </div>

    );
}


export default Register;