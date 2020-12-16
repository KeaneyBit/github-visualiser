
const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

async function searchUser() {

    const user = loginForm.username.value;
    const authorisation = loginForm.password.value !== "" ? loginForm.password.value : undefined;

    let info = await loadData(user, authorisation)

    let img = document.getElementById('img');
    img.src = info.avatar_url;

    // let repoInfo = await loadRepos(user, authorisation)
    // console.log(repoInfo);

    let newInfo = await getRequest(user, authorisation)
    console.log(newInfo.authorisation)
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


async function getRequest(user, token) {
    let url = `https://api.github.com/search/repositories?q=user:${user}`;
    const headers = {
        "Authorization" : `token 1a7fb31adeb0fe519bbf9ac7e14119d19759e9a4`
    }

    const response = (token == undefined) ? await fetch(url) : await fetch(url, {
        "method": "GET",
        "headers": headers
    });

    let data = await response.json();
    return data;
}
    







