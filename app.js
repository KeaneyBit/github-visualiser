
const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

async function searchUser() {

    const user = loginForm.username.value;
    const authorisation = loginForm.password.value !== "" ? loginForm.password.value : undefined;

    let info = await loadData(user, authorisation)

    if(info.name != null) {
        // var log = document.getElementById('daLogin');
        // log.style.opacity = 0; 

        let img = document.getElementById('img');
        img.src = info.avatar_url;

        let repoPublic = await loadRepos(user, undefined)
        console.log(repoPublic);

        let name = document.getElementById('name');
        name.innerHTML = `<b>Name: </b>${info.name}`;

        let login = document.getElementById('login');
        login.innerHTML = `<b>LUsername: </b>${info.login}`;

        let bio = document.getElementById('bio');
        bio.innerHTML = `<b>Details: </b>${info.bio == null ? 'No User Details' : info.bio}`;
    
        let hireable = document.getElementById('hireable');
        hireable.innerHTML = `<b>Hireable: </b>${(info.hireable != null) ? 'Yes' : 'No'}`;
    
        let created_at = document.getElementById('created_at');
        created_at.innerHTML = `<b>Account Creation Date: </b>${info.created_at}`;
    
        let followers = document.getElementById('followers');
        followers.innerHTML = `<b>Followers: </b>${info.followers}`;
    
        let following = document.getElementById('following');
        following.innerHTML = `<b>Following: </b>${info.following}`;
    
        let location = document.getElementById('location');
        location.innerHTML = `<b>Location: </b>${info.location}`;
    
        let public_repos = document.getElementById('public_repos');
        public_repos.innerHTML = `<b>Public Repos: </b>${info.public_repos}`;

        //location.replace("html/result.html");
    }
    

    let repoPrivate = await getPrivateRepos(user, authorisation)
    let private_repos = document.getElementById('private_repos');
    let total_repos = document.getElementById('total_repos');
    if(authorisation != undefined) {
        private_repos.innerHTML = `<b>Private Repos: </b>${repoPrivate.total_count - info.public_repos}`;
        total_repos.innerHTML = `<b>Total Repos: </b>${repoPrivate.total_count}`;
    } else {
        private_repos.innerHTML = `<b>Private Repos: Authentication Required</b>`;
        total_repos.innerHTML = `<b>Total Repos: Authentication Required</b>`;
    }
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
        //loadingIconStart();
    } else {
        loginErrorMsg.style.opacity = 1;
        //loadingIconEnd();
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

function loadingIconStart() {
    var grid = document.getElementById('daGrid');
    grid.style.opacity = 1;  
}

function loadingIconEnd() {
    var grid = document.getElementById('daGrid');
    grid.style.opacity = 0;
    
}
    
