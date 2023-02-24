

export default function Loading()
{
    return(
        <div className="flex flex-col h-screen w-screen justify-center items-center">
            <button className="btn loading btn-lg btn-square btn-accent"></button>
        </div>
    );
}

export function MiniLoading()
{
    return(
        <div className="flex flex-col h-full w-full justify-center items-center">
            <button className="btn loading btn-lg btn-square btn-accent"></button>
        </div>
    );
}