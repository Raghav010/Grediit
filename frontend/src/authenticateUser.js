

// sends username and pass and stores jwt in local storage
export default async function authUser(username,password)
{
    // store jwt in local storage
    // send jwt

    if (username == null || password == null) {
        return false;
    }


    //check if password matches, and get jwt 
    const auth = await fetch('/api/login', {
        method: 'POST',
        body: JSON.stringify({ username: username, password: password }),
        headers: {
            'Content-Type': 'application/json'
        }
    });


    if (auth.ok) {
        // saving the token
        const jwtToken = await auth.json();
        localStorage.setItem('jwtToken', jwtToken.token);
        return true;
    }
    else {
        return false;
    }
    
}

 