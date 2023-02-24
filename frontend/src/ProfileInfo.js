import { useState } from "react";
import { useNavigate } from "react-router-dom";


function ProfileInfo(props)
{  


    const navigate=useNavigate();


    let field;

    // reloads page too, to reflect changes
    //on password change logout
    async function updateField(e)
    {
        e.preventDefault();
        let newData=e.target.newData.value;
        //console.log(newData);
        let res=await fetch('/api/user/update/'+field,{
            method:"POST",
            body:JSON.stringify({data:newData}),
            headers:{
                'Content-Type':'application/json',
                'x-auth-token':localStorage.getItem('jwtToken')
            }
        })
        if(res.ok)
        {
            if(field=="password")
            {
                localStorage.removeItem("jwtToken");
            }
            navigate('/');
        }
        else
        {
            let err=await res.json();
            alert(err.error);
        }
    }

    return(
        <div className="flex flex-col lg:p-6 rounded-3xl space-y-0">
            <h2 className="text-6xl text-purple-600 font-bold">{props.data.fName} {props.data.lName}</h2> 
            <h2 className="text-3xl text-neutral-700 font-bold">{props.data.username}</h2>
            <h2 className="text-xl text-neutral-700 font-bold">{props.data.email}</h2> 
            <h2 className="text-3xl text-neutral-700 font-bold pt-5">Bio: Pesci on fire</h2>

            <label htmlFor="edit-modal" className="btn text-xl">Edit</label>
            <input type="checkbox" id="edit-modal" className="modal-toggle" />
            <div className="modal">
            <div className="modal-box relative">
                <label htmlFor="edit-modal" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                <select className="select select-bordered w-full max-w-xs mb-4">
                    <option disabled selected>What do you wanna edit?</option>
                    <option onClick={()=>(field="password")}>password</option>
                    <option onClick={()=>(field="fName")}>first name</option>
                    <option onClick={()=>(field="lName")}>last name</option>
                    <option onClick={()=>(field="email")}>email</option>
                    <option onClick={()=>(field="age")}>age</option>
                    <option onClick={()=>(field="phNum")}>phone number</option>
                </select>
                <form className=" form-control" onSubmit={updateField}>
                    <input type="text" placeholder="New" className="input w-full max-w-xs mb-4" name="newData" />
                    <button className="btn">Submit</button>
                </form>
            </div>
            </div>
        </div>
    );
}


export default ProfileInfo;