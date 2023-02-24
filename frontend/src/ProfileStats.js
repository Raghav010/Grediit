import {useEffect, useState} from 'react'
import { MiniLoading } from './Loading';


export default function ProfileStats()
{
    // always set state state to null for easy conditional rendering
    const [followers,setFollowers]=useState(null); // followers=[followersUsernames,followerCount]
    const [following,setFollowing]=useState(null); // following=[followingUsernames,followingCount]


    useEffect(()=>{
        async function fetchFollData(follType)
        {
            const follData=await fetch('/api/user/'+follType,{
                method:"GET",
                headers:{
                    'x-auth-token':localStorage.getItem('jwtToken')
                }
            })
            if(follData.ok)
            {
                let follArr=await follData.json();
                if(follType=="followers")
                    follArr=follArr.followers;
                else
                    follArr=follArr.following;
                //console.log(follArr);
                const follFormatted=follArr.map((uname)=>{
                    return(<p key={uname}>{uname}</p>);
                })
                if(follType=="followers")
                    setFollowers([follFormatted,follArr.length]);
                else
                    setFollowing([follFormatted,follArr.length]);
            }
            // error dont do anything

        }
        fetchFollData("followers");
        fetchFollData("following");
    },[])










    return(
        <div className="flex flex-row justify-evenly w-full h-full">
            <div className="dropdown lg:dropdown-bottom dropdown-top dropdown-hover">
                <label tabIndex={0} className="btn btn-outline lg:btn-wide btn-primary gap-3 mb-3 mt-3">
                Followers
                <div className="badge text-xl p-3">{followers?followers[1]:"-"}</div>
                </label>
                <div className="dropdown-content bg-violet-200 p-3 shadow rounded-xl flex flex-col w-full text-neutral-700 font-bold" tabIndex={0}>
                    {followers?(followers[0]):<MiniLoading />}
                </div>
            </div>
            <div className="dropdown lg:dropdown-bottom dropdown-top dropdown-hover">
                <label tabIndex={0} className="btn btn-outline lg:btn-wide btn-accent gap-3 mb-3 mt-3">
                Following
                <div className="badge text-xl p-3">{following?following[1]:"-"}</div>
                </label>
                <div className="dropdown-content bg-teal-200 p-3 shadow rounded-xl flex flex-col w-full text-neutral-700 font-bold" tabIndex={0}>
                    {following?(following[0]):<MiniLoading />}
                </div>
            </div>
        </div>
    );
}