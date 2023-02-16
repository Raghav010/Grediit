

function ProfileInfo(props)
{  // change font
    return(
        <div className="flex flex-col lg:p-6  hover:bg-teal-100 rounded-3xl space-y-0">
            <h2 className="text-6xl text-purple-600 font-bold">{props.data.fName} {props.data.lName}</h2> 
            <h2 className="text-3xl text-neutral-700 font-bold">{props.data.username}</h2>
            <h2 className="text-xl text-neutral-700 font-bold">{props.data.email}</h2> 
            <h2 className="text-3xl text-neutral-700 font-bold pt-5">Bio: Pesci on fire</h2>
        </div>
    );
}


export default ProfileInfo;