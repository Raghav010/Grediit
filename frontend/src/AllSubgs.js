import { useEffect, useState } from "react";
import { MiniLoading } from "./Loading";
import NavBar from './Navbar';
import { useNavigate } from "react-router-dom";




function JoinedSubgs(props)
{
    const navigate=useNavigate();
    const [subgs,setSubgs]=useState(null);

    async function leaveSubg(name)
    {
        let res=await fetch("/api/user/leaveSubg",{
            method:"POST",
            body:JSON.stringify({subg_name:name}),
            headers:{
                'Content-Type':'application/json',
                'x-auth-token':localStorage.getItem('jwtToken')
            }
        })
        if(res.ok)
        {
            props.rHelp(props.rVal+1);
        }
        else
        {
            //let err=await res.json();
            //alert(err.message);
            alert("Failed to leave sub greddiit");
        }
    }


    useEffect(()=>{
        async function fetchSubgs()
        {



            let joinedData=await fetch("/api/user/gFollowing/getAll",{
                method:"GET",
                headers:{
                    'x-auth-token':localStorage.getItem('jwtToken')
                }
            })

            let modData=await fetch("/api/user/mod/getAll",{
                method:"GET",
                headers:{
                    'x-auth-token':localStorage.getItem('jwtToken')
                }
            })
            
            if(joinedData.ok && modData.ok)
            {
                let decData=await joinedData.json();
                //console.log(decData);
                let joinedDataFormatted=[...Object.keys(decData)].map((gName)=>{
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
                                    <button className="btn btn-ghost" onClick={()=>(leaveSubg(gName))}>Leave</button>
                                </div>
                            </div>
                        </div>
                    )
                })

                decData=await modData.json();
                let modDataFormatted=[...Object.keys(decData)].map((gName)=>{
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
                                </div>
                            </div>
                        </div>
                    )
                })

                setSubgs(modDataFormatted.concat(joinedDataFormatted));
            }
        }
        fetchSubgs();

    },[props.rVal])



    return(
        <div className="flex flex-row flex-wrap mt-6 justify-center gap-5">
            {subgs?subgs:<MiniLoading />}
        </div>
    )
}


function ExploreSubgs(props)
{
    const [subgs,setSubgs]=useState(null);

    async function joinSubg(name)
    {
        let res=await fetch("/api/user/sendSubgReq",{
            method:"POST",
            body:JSON.stringify({subg_name:name}),
            headers:{
                'Content-Type':'application/json',
                'x-auth-token':localStorage.getItem('jwtToken')
            }
        })
        if(res.ok)
        {
            alert("Sent join request!");
        }
        else
        {
            alert("Failed to send join request to sub-greddiit");
        }
    }


    useEffect(()=>{
        async function fetchSubgs()
        {



            let data=await fetch("/api/subg/getAll",{
                method:"GET",
                headers:{
                    'x-auth-token':localStorage.getItem('jwtToken')
                }
            })
            
            if(data.ok)
            {
                let decData=await data.json();
                //console.log(decData);
                let dataFormatted=decData.allSubgs.map((gData)=>{
                    return(
                        <div className="card w-96 bg-neutral text-neutral-content" key={gData.name}>
                            <div className="card-body items-center text-center">
                                <h2 className="card-title text-3xl">{gData.name}</h2>
                                <p>{gData.description}</p>
                                <p>Followers: {gData.followerCount}</p>
                                <p>Posts: {gData.postCount}</p>
                                <p>Banned words:{[...Object.keys(gData.banned)].toString()}</p>
                                <div className="card-actions justify-end">
                                    <button className="btn btn-primary" onClick={()=>(joinSubg(gData.name))}>Join</button>
                                </div>
                            </div>
                        </div>
                    )
                })
                setSubgs(dataFormatted);
            }
        }
        fetchSubgs();

    },[props.rVal])



    return(
        <div className="flex flex-row flex-wrap mt-6 justify-center gap-5">
            {subgs?subgs:<MiniLoading />}
        </div>
    )
}




export default function PublicSubgPage()
{
    const [refresh,setRefresh]=useState(0);



    return(
        <>
            <NavBar />
            <div className="bg-purple-50 h-screen w-screen flex flex-col items-center p-5">
                <h2 className="text-5xl text-accent font-bold">Joined Sub-greddiits</h2>
                <JoinedSubgs rVal={refresh} rHelp={setRefresh} />
                <h2 className="text-5xl text-accent font-bold">Explore Sub-greddiits</h2>
                <ExploreSubgs rVal={refresh} rHelp={setRefresh} />
            </div>
        </>
    )
}