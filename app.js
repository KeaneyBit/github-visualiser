
const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

async function searchUser() {

    const user = loginForm.username.value;
    const authorisation = loginForm.password.value !== "" ? loginForm.password.value : undefined;

    let info = await loadData(user, authorisation)

    if(info.name != null) {
        let img = document.getElementById('img');
        img.src = info.avatar_url;

        let repoPublic = await loadRepos(user, undefined)
        console.log(repoPublic);

        let name = document.getElementById('name');
        name.innerHTML = `<b>Name: </b>${info.name}`;

        let login = document.getElementById('login');
        login.innerHTML = `<b>Login ID: </b>${info.login}`;

        let bio = document.getElementById('bio');
        bio.innerHTML = `<b>Bio: </b>${info.bio == null ? 'No User Bio' : info.bio}`;
    }
    

    let repoPrivate = await getPrivateRepos(user, authorisation)
    console.log(repoPrivate)
}

async function httpRequest(url, token) {
    const headers = {'Authorization': `token ${token}`}
    const response = (token == undefined) ? await fetch(url) : await fetch(url, {"method": "GET", "headers": headers});
    return await response.json();
}

async function loadData(user, token) {
    //let url = `https://api.github.com/users/${user}/repos`;
    
    //let repo = await httpRequest(url, token).catch(error => console.error(error));

    let url = `https://api.github.com/users/${user}`;
    let user_info = await httpRequest(url, token).catch(error => console.error(error));
    
    if (user_info.name != null) {
        loginErrorMsg.style.opacity = 0;
        // html.style.display = "none"
        alert("Sucessful Request");
    } else {
        loginErrorMsg.style.opacity = 1;
    }

    return user_info;
}

async function loadRepos(user, token) {
    let url = `https://api.github.com/users/${user}/repos`;
    
    let repo = await httpRequest(url, token).catch(error => console.error(error));
    return repo;
}


async function getPrivateRepos(user, token) {
    let url = `https://api.github.com/search/repositories?q=user:${user}`;
    const headers = {
        "Authorization" : `token ${token}`
    }

    const response = (token == undefined) ? await fetch(url) : await fetch(url, {
        "method": "GET",
        "headers": headers
    });

    let data = await response.json();
    return data;
}
    







