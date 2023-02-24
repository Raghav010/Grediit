import { useEffect, useState } from "react";
import { MiniLoading } from "./Loading";
import validator from "validator";
import NavBar from './Navbar';
import { useNavigate } from "react-router-dom";



// create subg component---------------------------------------------------
function CreateSubg(props)
{

    const [inputsValid,setInputsValid]=useState([false,false,false]);
    const [btnClicked,setBtnClicked]=useState(false);

    function validate(e,index)
    {
        // checking if they are of length at least 1
        let input=e.target.value;
        let dup=inputsValid.slice();
        
        if(validator.isLength(input,{min:1}))
            dup[index]=true;
        else
            dup[index]=false;
        setInputsValid(dup);
    }



    async function create(e)
    {
        // split tags and banned keyword into arrays
        // disregrad empty strings in tags and banned keywords
        e.preventDefault();
        let tags=e.target.tags.value;
        tags=tags.trim();
        tags=tags.split(",");
        tags=tags.filter((tag)=>{
            return (tag.trim().length!=0)
        })
        console.log(tags);

        let banned=e.target.banned.value;
        banned=banned.trim();
        banned=banned.split(",");
        banned=banned.filter((word)=>{
            return (word.trim().length!=0)
        })
        // converting to a dictionary
        let bannedDict={}
        for (let word of banned)
        {
            bannedDict[word]=1;
        }
        console.log(bannedDict);


        let res=await fetch("/api/subg/create",{
            method:"POST",
            body:JSON.stringify({name:e.target.name.value,description:e.target.description.value,tags:tags,banned:bannedDict}),
            headers:{
                'Content-Type':'application/json',
                'x-auth-token':localStorage.getItem('jwtToken')
            }
        })

        if(res.ok)
        {
            // refresh, page or just the display subgs part
            props.rHelp(props.rVal+1);
            console.log("created");
        }
        else
        {
            let err=await res.json();
            alert(err.message);
        }


    }

    // add on creating closes modal
    return(
        <>
        <label htmlFor="createSubg" className="btn btn-primary">Create</label>
        <input type="checkbox" id="createSubg" className="modal-toggle" />
        <div className="modal">
            <div className="modal-box relative">
                <label htmlFor="createSubg" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                <form className="form-control" onSubmit={create}>
                    <input type="text" placeholder="Name" className="input input-bordered w-full max-w-xs m-3" name="name" onChange={e=>(validate(e,0))}/>
                    <input type="text" placeholder="Description" className="input input-bordered w-full max-w-xs m-3" name="description" onChange={e=>(validate(e,1))}/>
                    <input type="text" placeholder="tags" className="input input-bordered w-full max-w-xs m-3" name="tags" onChange={e=>(validate(e,2))}/>
                    <input type="text" placeholder="banned keywords" className="input input-bordered w-full max-w-xs m-3" name="banned"/>
                    <button className={"btn "+(btnClicked?"loading":"")} disabled={!(inputsValid[0]&&inputsValid[1]&&inputsValid[2])} onClick={()=>setBtnClicked(true)}>Create</button>
                </form>
            </div>
        </div>
        </>
    )
}













// display component------------------------------------------------
function DisplayModSubg(props)
{
    const navigate=useNavigate();
    const [modSubgs,setModSubgs]=useState(null);

    async function deleteSubg(name)
    {
        let res=await fetch("/api/subg/delete/"+name,{
            method:"POST",
            headers:{
                'x-auth-token':localStorage.getItem('jwtToken')
            }
        })
        if(res.ok)
        {
            props.rHelp(props.indicator+1);
        }
        else
        {
            alert("Failed to delete sub greddiit");
        }
    }


    useEffect(()=>{
        async function fetchModSubgs()
        {



            let data=await fetch("/api/user/mod/getAll",{
                method:"GET",
                headers:{
                    'x-auth-token':localStorage.getItem('jwtToken')
                }
            })
            
            if(data.ok)
            {
                let decData=await data.json();
                console.log(decData);
                let dataFormatted=[...Object.keys(decData)].map((gName)=>{
                    let gData=decData[gName];
                    return(
                        <div className="card w-96 bg-neutral text-neutral-content" key={gName}>
                            <div className="card-body items-center text-center">
                                <h2 className="card-title text-3xl">{gName}</h2>
                                <p>{gData.description}</p>
                                <p>Followers: {gData.followerCount}</p>
                                <p>Posts: {gData.postCount}</p>
                                <p>Banned words:{[...Object.keys(gData.banned)].toString()}</p>
                                <div className="card-actions justify-end">
                                    <button className="btn btn-primary" onClick={()=>(navigate("/subG/"+gName))}>Open</button>
                                    <button className="btn btn-ghost" onClick={()=>(deleteSubg(gName))}>Delete</button>
                                </div>
                            </div>
                        </div>
                    )
                })
                setModSubgs(dataFormatted);
            }
        }
        fetchModSubgs();

    },[props.indicator])



    return(
        <div className="flex flex-row flex-wrap mt-6 justify-center gap-5">
            {modSubgs?modSubgs:<MiniLoading />}
        </div>
    )


}













export default function Mysubgs()
{

    const [refresh,setRefresh]=useState(0);

    return(
        <>
            <NavBar />
            <div className="bg-purple-50 h-screen w-screen flex flex-col items-center p-10">
                <CreateSubg rHelp={setRefresh} rVal={refresh} />
                <DisplayModSubg indicator={refresh} rHelp={setRefresh} />
            </div>
        </>
    )
}