import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Grediit from './grediit.png'

// this component takes up the entire width and height of the container

function Register(props)
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
    async function RegisterRedirect(e)
    {
        // getting the form data in JSON form
        e.preventDefault();
        const encData=new FormData(e.target);
        const values=Object.fromEntries(encData.entries()); 

        //console.log(JSON.stringify(values));
        // sending data to the server
        const response=await fetch('/api/register',{
            method: 'POST',
            body: JSON.stringify(values),
            headers:{
                'Content-Type':'application/json'
            }
        });

        
        // checking if registration succeeded
        if(!response.ok)
        {
            alert('Username or email address already exists!');
        }
        else
        {
            props.changeMode("Login");
        }
    }




    return (

        <div className="bg-purple-900 shadow-2xl rounded-xl h-full w-full flex flex-row justify-center items-center p-4">
            <div className="flex flex-col justify-center items-center w-2/3 max-w-full">
                <h1 className="text-white font-bold text-4xl pb-10 w-fit max-w-full">Register</h1>
                <form className="form-control" onSubmit={RegisterRedirect}>
                    <input className="input input-ghost text-white bg-purple-900 focus:bg-white w-full max-w-full" type="text" placeholder="First Name" onChange={e=>Enable(e,0)} name="fName"></input>
                    <div className="divider m-0 lg:m-2"></div>
                    <input className="input input-ghost text-white bg-purple-900 focus:bg-white w-full max-w-full" type="text" placeholder="Last Name" onChange={e=>Enable(e,1)} name="lName"></input>
                    <div className="divider m-0 lg:m-2"></div>
                    <input className="input input-ghost text-white bg-purple-900 focus:bg-white w-full max-w-full" type="text" placeholder="Username" onChange={e=>Enable(e,2)} name="username"></input>
                    <div className="divider m-0 lg:m-2"></div>
                    <input className="input input-ghost text-white bg-purple-900 focus:bg-white w-full max-w-full" type="email" placeholder="Email" onChange={e=>Enable(e,3)} name="email"></input>
                    <div className="divider m-0 lg:m-2"></div>
                    <input className="input input-ghost text-white bg-purple-900 focus:bg-white w-full max-w-full" type="number" placeholder="Age" onChange={e=>Enable(e,4)} min="18" name="age"></input>
                    <div className="divider m-0 lg:m-2"></div>
                    <input className="input input-ghost text-white bg-purple-900 focus:bg-white w-full max-w-full" type="tel" placeholder="Phone Number" onChange={e=>Enable(e,5)} maxLength="10" minLength="10" name="phNum"></input>
                    <div className="divider m-0 lg:m-2"></div>
                    <input className="input input-ghost text-white bg-purple-900 focus:bg-white w-full max-w-full" type="password" placeholder="Password" onChange={e=>Enable(e,6)} minLength="5" name="password"></input>
                    <button className="btn btn-active mt-4 w-full max-w-full" disabled={!enable}>Register</button>
                </form>
            </div>
            <div className="divider divider-horizontal"></div>
            <div className="flex flex-col self-start justify-evenly h-full items-center w-1/3">
                <img className="aspect-square w-3/4" src={Grediit}></img>
                <h1 className="text-white font-bold lg:text-4xl text-3xl">Grediit</h1>
            </div>
        </div>

    );
}


export default Register;