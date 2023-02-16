import ProfileInfo from "./ProfileInfo";
import ProfilePhoto from './pesci.png';
import ProfileStats from "./ProfileStats";
import { useNavigate,useParams } from "react-router-dom";
import { useEffect,useState } from "react";
import Loading from "./Loading";
import Logout from "./Logout";
import Grediit from './grediit.png'
import authUser from "./authenticateUser";

function Profile()
{
    const navigate=useNavigate();
    let urlParams=useParams(); // custom url for each profile
    const [fetched,setFetched]=useState(false);
    const [userdata,setUserdata]=useState(null);

    // protecting this route--------------
    // and loading profile info data ; passes it on to profileInfo component
    useEffect(()=>{

        const auth=async ()=>{
            const authed = await fetch('/api/userInfo', {
                method: 'GET',
                headers: {
                    'x-auth-token': localStorage.getItem('jwtToken')
                }
            });
            

            //console.log(authed);
            if (authed.ok) 
            {
                const data=await authed.json();
                if(data.username!=urlParams.username)
                    navigate('/');
                else
                {
                    setUserdata(data);
                    setFetched(true);
                }
            }
            else
            {
                navigate('/');
            }
        };

        auth();
    },[]);

    if(fetched==false)
    {
        return <Loading />;
    }

    // if authorized render the actual page
    return(
        <div className="h-screen w-screen bg-purple-50">
            <div className="flex flex-col h-full w-full justify-center">
                <div className="flex flex-row h-20 w-full justify-between px-8 pt-2">
                    <img className="aspect-square h-full pb-2" src={Grediit}></img>
                    <div className=" m-4 mt-0">
                        <Logout />
                    </div>
                </div>
                <div className="flex flex-col items-center lg:flex-row lg:items-start h-5/6 w-full lg:px-16 px-6 py-6">
                    <div className="flex flex-col lg:w-3/5 lg:h-3/4 space-y-2.5 items-start">
                        <img className="aspect-square w-3/4 lg:w-1/2 border-solid border border-neutral-700 border-4 rounded-full" src={ProfilePhoto}></img>
                        <ProfileInfo data={userdata}/>
                    </div>
                    <div className="lg:w-2/5 lg:h-full h-1/4 flex flex-col">
                        <div className="m-6 lg:mt-10">
                            <ProfileStats />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Profile;