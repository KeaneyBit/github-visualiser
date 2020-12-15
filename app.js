
const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");

async function searchUser() {

    const user = loginForm.username.value;
    const authorisation = loginForm.password.value !== "" ? loginForm.password.value : undefined;

    loadData(user, authorisation)
}

async function httpRequest(url, authorisation) {
    const headers = {'Authorization': `Token ${authorisation}`}
    const response = (authorisation == undefined) ? await fetch(url) : await fetch(url, {"method": "GET", "headers": headers});
    return await response.json();
}

async function loadData(user, token) {
    let url = `https://api.github.com/users/${user}/repos`;
    
    let repo = await httpRequest(url, token).catch(error => console.error(error));

    url = `https://api.github.com/users/${user}`;
    let user_info = await httpRequest(url, token).catch(error => console.error(error));
    
    if (user_info.name != null) {
        loginErrorMsg.style.opacity = 0;
        alert("Sucessful Request");
    } else {
        loginErrorMsg.style.opacity = 1;
    }
}

    







