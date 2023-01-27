import ProfileInfo from "./ProfileInfo";
import ProfilePhoto from './pesci.png';
import ProfileStats from "./ProfileStats";
import { useNavigate,useParams } from "react-router-dom";
import { useEffect,useState } from "react";
import Loading from "./Loading";
import Logout from "./Logout";
import Grediit from './grediit.png'

function Profile()
{
    const navigate=useNavigate();
    let urlParams=useParams(); // custom url for each profile
    const [authorized,setAuthorized]=useState(false);
    

    // protecting this route--------------
    // useEffect is used so it runs 
    useEffect(()=>{
        if (localStorage.getItem("username") == null) {
            navigate('/');
        }
        else
        {
            setAuthorized(true);
        }
    },[navigate,setAuthorized]);

    if(authorized==false)
    {
        return <Loading />;
    }

    // if authorized render the actual page
    return(
        <div className="h-screen w-screen bg-purple-50">
            <div className="flex flex-row h-full w-full px-16 py-6">
                <div className="flex flex-col w-3/5 h-3/4 space-y-2.5 items-start">
                    <img className="aspect-square w-16" src={Grediit}></img>
                    <img className="aspect-square w-1/2 border-solid border border-neutral-700 border-4 rounded-full" src={ProfilePhoto}></img>
                    <ProfileInfo username={urlParams.username}/>
                </div>
                <div className="w-2/5 h-full flex flex-col">
                    <div className="self-end m-4 mt-0">
                        <Logout />
                    </div>
                    <div className="m-6 mt-10">
                        <ProfileStats />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;