import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MiniLoading } from "./Loading";
import NavBar from './Navbar';






function Users(props)
{

    const [blocked,setBlocked]=useState(null);
    const [normal,setNormal]=useState(null);

    useEffect(()=>{
        async function getFollowers()
        {
            let res=await fetch('/api/subg/getFollowers/'+props.params.gName,{
                method:"GET",
                headers:{
                    'x-auth-token':localStorage.getItem('jwtToken')
                }
            })

            if(res.ok)
            {
                let data=await res.json();
                //console.log(data.normal,data.blocked);
                let normalFormatted=data.normal.map((username)=>{
                    return(
                        <p className=" text-primary text-2xl">{username}</p>
                    )
                })
                let blockedFormatted=data.blocked.map((username)=>{
                    return(
                        <p className=" text-primary text-2xl">{username}</p>
                    )
                })
                setBlocked(blockedFormatted);
                setNormal(normalFormatted);
            }
        }
        getFollowers();
    },[])


    return(
        <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
                <h2 className="card-title text-accent text-4xl">Users</h2>
                {normal?normal:<MiniLoading />}
                <h2 className="card-title text-accent text-4xl">Blocked</h2>
                {blocked?blocked:<MiniLoading />}
            </div>
        </div>
    )


}

function Home(props)
{
    const [basicInfo,setBasicInfo]=useState(null);


    useEffect(()=>{
        async function fetchBasicInfo()
        {



            let data=await fetch("/api/subg/getBInfo/"+props.params.gName,{
                method:"GET",
                headers:{
                    'x-auth-token':localStorage.getItem('jwtToken')
                }
            })
            
            if(data.ok)
            {
                let decData=await data.json();
                console.log(decData);
                let dataFormatted=(
                        <div className="card w-96 bg-neutral text-neutral-content" key={decData.name}>
                            <div className="card-body items-center text-center">
                                <h2 className="card-title text-3xl text-accent">{decData.name}</h2>
                                <p>{decData.description}</p>
                                <p>Followers: {decData.followerCount}</p>
                                <p>Posts: {decData.postCount}</p>
                                <p>Banned words:{[...Object.keys(decData.banned)].toString()}</p>
                            </div>
                        </div>
                    );
                
                setBasicInfo(dataFormatted);
            }
        }
        fetchBasicInfo();

    },[])



    return(
        <div className="flex flex-row mt-6 justify-center">
            {basicInfo?basicInfo:<MiniLoading />}
        </div>
    )

}









function Requests(props)
{

    const [requests,setRequests]=useState(null);
    const [reload,setReload]=useState(0);

    async function reqHandler(username,action)
    {
        let res=await fetch("/api/subg/req/"+action,{
            method:"POST",
            body:JSON.stringify({subg_name:props.params.gName,username:username}),
            headers:{
                'Content-Type':'application/json',
                'x-auth-token': localStorage.getItem('jwtToken')
            }
        })

        if(res.ok)
        {
            setReload(reload+1);
        }
        else
        {
            //let err=await res.json();
            alert("Failed to "+action+" request");
            //alert(err.message);
        }
    }




    useEffect(()=>{

        async function getRequests()
        {
            let data=await fetch("/api/subg/getReq/"+props.params.gName,{
                method:"GET",
                headers:{
                    'x-auth-token':localStorage.getItem('jwtToken')
                }
            })

            if(data.ok)
            {
                let decData=await data.json();
                let formattedData=decData.requests.map((username)=>{
                    return(
                        <p className=" text-primary text-2xl font-extrabold" key={username}>
                            {username}
                            <button className="btn mx-3" onClick={()=>(reqHandler(username,"accept"))}>Accept</button>
                            <button className="btn mx-3" onClick={()=>{reqHandler(username,"reject")}}>Reject</button>
                        </p>
                    )
                })
                setRequests(formattedData);
            }
        }
        getRequests();


    },[reload])



    return(
        <div className="card w-3/4 bg-base-100 shadow-xl">
            <div className="card-body items-center text-center">
                <h2 className="card-title text-accent text-4xl">Requests</h2>
                {requests?requests:<MiniLoading />}
            </div>
        </div>
    )
}





export default function SubgPage()
{

    const [mode,setMode]=useState("home");
    const parameters=useParams(); // name will be passed as param


    return(
        <>
            <NavBar condRender={true} mode={[mode,setMode]} />
            <div className="bg-purple-50 h-screen w-screen flex flex-col items-center p-10">
                {mode=="home" && <Home params={parameters} />}
                {mode=="users" && <Users params={parameters} />}
                {mode=="requests" && <Requests params={parameters} />}
            </div>
        </>
    )
}