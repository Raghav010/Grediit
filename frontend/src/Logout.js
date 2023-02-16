import { useNavigate } from "react-router-dom";


export default function Logout()
{
    const navigate=useNavigate();

    function esc()
    {
        localStorage.removeItem("jwtToken");
        navigate("/");
    }

    return(
        <div className="w-full h-full">
            <button className="btn btn-outline btn-primary" onClick={esc}>Logout</button>
        </div>
    );
}