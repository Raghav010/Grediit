

export default function ProfileStats()
{
    return(
        <div className="flex flex-row justify-evenly w-full h-full">
            <div className="dropdown lg:dropdown-bottom dropdown-top dropdown-hover">
                <label tabIndex={0} className="btn btn-outline lg:btn-wide btn-primary gap-3 mb-3 mt-3">
                Followers
                <div className="badge text-xl p-3">669</div>
                </label>
                <div className="dropdown-content bg-violet-200 p-3 shadow rounded-xl flex flex-col w-full text-neutral-700 font-bold" tabIndex={0}>
                    <p>Tom Cruise</p>
                    <p>Reddy Anna</p>
                    <p>Kylian Mbappe</p>
                </div>
            </div>
            <div className="dropdown lg:dropdown-bottom dropdown-top dropdown-hover">
                <label tabIndex={0} className="btn btn-outline lg:btn-wide btn-accent gap-3 mb-3 mt-3">
                Following
                <div className="badge text-xl p-3">1.2k</div>
                </label>
                <div className="dropdown-content bg-teal-200 p-3 shadow rounded-xl flex flex-col w-full text-neutral-700 font-bold" tabIndex={0}>
                    <p>Elon</p>
                    <p>Rando</p>
                    <p>sock</p>
                    <p>Hi</p>
                </div>
            </div>
        </div>
    );
}