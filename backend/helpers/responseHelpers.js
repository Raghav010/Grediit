

// returns {error:""}
function errorResp(res,error_message)
{
    res.status(400).json({error:error_message});
}

// returns {message:""}
function goodResp(res,message)
{
    res.status(200).json({message:message});
}

module.exports={errorResp,goodResp};