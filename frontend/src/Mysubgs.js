import Loading from "./Loading";
import { MiniLoading } from "./Loading";


function createSubg()
{
    // disabling buttons
    // input validation frontend and backenf for creating subgs
    //
    async function create(e)
    {
        e.preventDefault();
    }


    return(
        <>
        <label htmlFor="createSubg" className="btn btn-primary">Create</label>
        <input type="checkbox" id="createSubg" className="modal-toggle" />
        <div className="modal">
            <div className="modal-box relative">
                <label htmlFor="createSubg" className="btn btn-sm btn-circle absolute right-2 top-2">✕</label>
                <form className="form-control" onSubmit={create}>

                </form>
            </div>
        </div>
        </>
    )
}



export default function Mysubgs()
{

}