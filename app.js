
const loginForm = document.getElementById("login-form");
const loginButton = document.getElementById("login-form-submit");
const loginErrorMsg = document.getElementById("login-error-msg");
const loginErrorSuc = document.getElementById("login-sucess-msg");

let pubRepo;
let priRepo;
let theUser;
let authO;

var chart1 = null;
var chart2 = null;
var chart3 = null;
var commitChart = null;
var myChart = null;

async function searchUser() {
    destroyCharts();
    
    //const user = loginForm.username.value;
    const user = loginForm.username.value !== "" ? loginForm.username.value : "keaneyjo";
    //const authorisation = loginForm.password.value !== "" ? loginForm.password.value : undefined;
    const authorisation = loginForm.password.value !== "" ? loginForm.password.value : "2874b9642a9bb20e73d46141b55fd7e025d1d493";

    let info = await loadData(user, authorisation)
    theUser = info;
    authO = authorisation;
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
        login.innerHTML = `<b>Username: </b>${info.login}`;

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
    priRepo = repoPrivate;
    let private_repos = document.getElementById('private_repos');
    let total_repos = document.getElementById('total_repos');
    
    if(authorisation != undefined) {
        private_repos.innerHTML = `<b>Private Repos: </b>${repoPrivate.total_count - info.public_repos}`;
        total_repos.innerHTML = `<b>Total Repos: </b>${repoPrivate.total_count}`;
        let repo = await getPrivateRepos(user, undefined)
        makePie(repoPrivate, user, authorisation);
        get_commits_polarArea(repo, user, undefined);
    } else {
        private_repos.innerHTML = `<b>Private Repos: Authentication Required</b>`;
        total_repos.innerHTML = `<b>Total Repos: Authentication Required</b>`;
        //get_commits_polarArea(info.public_repos, user, authorisation);
        let repo = await getPrivateRepos(user, undefined)
        makePie(repo, user, undefined);
        get_commits_polarArea(repo, user, undefined);
        
    }
    listRepos("slct1")
    findThatRepo(user, authorisation);

    leanTime(user, authorisation);
    
    
}

async function leanTime(user, authorisation) {
    let repoInfo = priRepo;
    user = theUser.login;
    token = authO;

    //
    let leanTime = 0;
    let leanDays = 0;
    for(i in repoInfo.items) {
        let commits = await getReposCommits(user, token, repoInfo.items[i].name);
        let date1 = new Date(commits[0].commit.author.date);
        let date2 = new Date(commits[commits.length-1].commit.author.date);
        leanTime = date1.getTime() - date2.getTime();
        leanDays +=  leanTime / (1000 * 3600 * 24);
    }
    let leanTotal = leanDays;
    leanDays /= repoInfo.total_count;
    leanDays = Math.ceil(leanDays);

    let sopiHead = document.getElementById('sopiHead');
    sopiHead.innerHTML = leanDays;
    sopiHead = document.getElementById('act');
    sopiHead.innerHTML = leanDays;
    sopiHead = document.getElementById('num');
    sopiHead.innerHTML = Math.ceil(leanTotal);
    sopiHead = document.getElementById('dem');
    sopiHead.innerHTML = repoInfo.total_count;
}


async function listRepos(sele) {
    var optionArray = priRepo.items;
    var s1 = document.getElementById(sele);
	s1.innerHTML = "";
	for(var option in optionArray){
		var newOption = document.createElement("option");
		newOption.value = optionArray[option].name;
		newOption.innerHTML = optionArray[option].name
		s1.options.add(newOption);
	}
}


async function httpRequest(url, token) {
    const headers = {'Authorization': `token ${token}`}
    const response = (token == undefined) ? await fetch(url) : await fetch(url, {"method": "GET", "headers": headers});
    return await response.json();
}

async function loadData(user, token) {
    let url = `https://api.github.com/users/${user}`;
    let user_info = await httpRequest(url, token).catch(error => console.error(error));
    
    if (user_info.name != null) {
        loginErrorMsg.style.opacity = 0;
        loginErrorSuc.style.opacity = 1;
        // html.style.display = "none"
        //alert("Sucessful Request");
        loadingIconStart();
  
    } else {
        loginErrorMsg.style.opacity = 1;
        loginErrorSuc.style.opacity = 0;
        loadingIconEnd();
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
    var grid = document.getElementById('daSidebar');
    grid.style.opacity = 1;  
    // var grid = document.getElementById('daSidebar2');
    // grid.style.opacity = 1;
    grid = document.getElementById('daNaive');
    grid.style.opacity = 1; 

    grid = document.getElementById('li1');
    grid.style.opacity = 1; 
    grid = document.getElementById('li2');
    grid.style.opacity = 1; 
    grid = document.getElementById('li3');
    grid.style.opacity = 1; 
    grid = document.getElementById('li4');
    grid.style.opacity = 1; 
}

function loadingIconEnd() {
    var grid = document.getElementById('daSidebar');
    grid.style.opacity = 0;
    // var grid = document.getElementById('daSidebar2');
    // grid.style.opacity = 0;
    grid = document.getElementById('daNaive');
    grid.style.opacity = 0;  

    grid = document.getElementById('li1');
    grid.style.opacity = 0; 
    grid = document.getElementById('li2');
    grid.style.opacity = 0; 
    grid = document.getElementById('li3');
    grid.style.opacity = 0; 
    grid = document.getElementById('li4');
    grid.style.opacity = 0; 
    
}
    
async function getReposCommits(user, token, name) {
    let url = `https://api.github.com/repos/${user}/${name}/commits?per_page=300`;
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



async function makePie(repo, user, token) {
    let label = [];let data = []; let backgroundColor = [];

    for (i in repo.items) {
        let url = `https://api.github.com/repos/${user}/${repo.items[i].name}/languages`;
        let languages = await httpRequest(url, token).catch(error => console.error(error));
        for (language in languages) {
            if (label.includes(language)) {
                for (i = 0; i < label.length; i++)
                    if (language == label[i])
                        data[i] = data[i] + languages[language];
            } else {
                label.push(language);
                data.push(languages[language]);
                backgroundColor.push(`rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.7)`);
            }
        }

    }    
    drawPie('lang', 'pie', 'languages', "PieChart of Most Popular Languages (Naive)", label, data, backgroundColor);
}
function drawPie(ctx, type, datasetLabel, titleText, label, data, backgroundColor) {

    let myChart = document.getElementById(ctx).getContext('2d');
    chart2 = new Chart(myChart, {
        type: type,
        data: {
            labels: label,
            datasets: [{
                label: datasetLabel,
                data: data,
                backgroundColor: backgroundColor,
                borderWidth: 1,
                borderColor: '#ababab',
                hoverBorderWidth: 2,
                hoverBorderColor: '#000'
            }],

        },
        options: {
            title: {
                display: true,
                text: titleText,
                fontSize: 20
            },
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    fontColor: '#000'
                }
            },
            layout: {
                padding: {
                    left: 50,
                    right: 0,
                    bottom: 0,
                    top: 0
                }
            },
            tooltips: {
                enabled: true
            }
        }
    });
}
////////////////////////////////////////
async function findThatRepo(user, token) {
    let label = [];
    let data = [];
    let backgroundColor = [];
    let count = 0;
    var s1 = document.getElementById('slct1');
    let repoInfo = priRepo;
    user = theUser.login;
    token = authO;


    //let repoInfo = await getPrivateRepos(user, token);
    for(i in repoInfo.items) {
        if(repoInfo.items[i].name == s1.value) {
            //repoInfo.items[i]
            let commits = await getReposCommits(user, token, repoInfo.items[i].name);
            for (j in commits) {
                let date = commits[j].commit.author.date;
                
                var d = new Date(date);

                var y = d.getFullYear().toString();
                var k = d.getMonth().toString();
                var l = d.getDate().toString();
                k = y + "/" + k + "/" + l;
                    if (label.includes(k)) {
                        for (i = 0; i < label.length; i++)
                            if (k == label[i]) {
                                count++;
                                data[i] = count;
                            }
        
                    } else {
                        label.unshift(k); //Month + Day
                        count++;
                        data.unshift(count);
                        backgroundColor.push(`rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`);
                    }
            }
            label.sort();
            data.sort();
        }
        if(data.length > 1) {
            data[0] = data[1];
            data[data.length-1] = data[data.length-2];
        }
    }
    let myChart = document.getElementById("commitPerRepo").getContext('2d');
    if (myChart != null) myChart = null;
    if (chart1 != null) chart1= null;
    if (chart2 != null) chart2= null;
    if (chart3 != null) chart3= null;
    createGraphOutline(data, label);
    //cycleTimeGraph(data, label);

    //alert("Hey you!" + s1.value);


}


//https://api.github.com/repos/octocat/hello-world
function createConfig(details, data, labels1) {
    return {
      type: 'line',
      data: {
        labels: labels1,
        datasets: [{
          label: 'steppedLine',
          steppedLine: details.steppedLine,
          data: data,
          borderColor: details.color,
          fill: false,
        }]
      },
      options: {
        scales: {
            x: {
                type: 'time',
                time: {
                    unit: 'day'
                },
                distribution: 'linear'
            }
        },
        responsive: true,
        title: {
          display: true,
          text: details.label,
        }

      }
    };
}

//createGraphOutline
function createGraphOutline(data, labels) {

    var steppedLineSettings = [ {
      steppedLine: 'before',
      label: 'Most Recent Commit History Per Repository',
      color: 'rgb(54, 162, 235)'
    }];

    steppedLineSettings.forEach(function(details) {
        var config = createConfig(details, data, labels);
        let myChart = document.getElementById("commitPerRepo").getContext('2d');
        new Chart(myChart, config);
    });
};


// get_commits_polarArea(repo:json, user:string, token:string) -> Display polarArea Graph
async function get_commits_polarArea(repo, user, token) {
    let label = [];
    let data = [];
    let backgroundColor = [];
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

    for (i in repo.items) {
        let url = `https://api.github.com/repos/${user}/${repo.items[i].name}/commits?per_page=100`;
        let commits = await httpRequest(url, token).catch(error => console.error(error));

        for (j in commits) {
            let date = commits[j].commit.author.date;

            var d = new Date(date);
            let day = days[d.getDay()];

            if (label.includes(d)) {
                for (i = 0; i < label.length; i++)
                    if (day == label[i])
                        data[i] += 1;

            } else {
                label.push(day);
                data.push(1);
                backgroundColor.push(`rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`);
            }
        }
    }
    draw1('commits', 'polarArea', 'commits', ` Scatter Plot of Commits Time Line`, label, data, backgroundColor);
}
// draw1(...) -> draws first graph
function draw1(ctx, type, datasetLabel, titleText, label, data, backgroundColor) {

    let myChart = document.getElementById(ctx).getContext('2d');

    chart1 = new Chart(myChart, {
        type: type,
        data: {
            labels: label,
            datasets: [{
                label: datasetLabel,
                data: data,
                backgroundColor: backgroundColor,
                borderWidth: 1,
                borderColor: '#777',
                hoverBorderWidth: 2,
                hoverBorderColor: '#000'
            }],

        },
        options: {
            title: {
                display: true,
                text: titleText,
                fontSize: 20
            },
            legend: {
                display: true,
                position: 'bottom',
                labels: {
                    fontColor: '#000'
                }
            },
            layout: {
                padding: {
                    left: 50,
                    right: 0,
                    bottom: 0,
                    top: 0
                }
            },
            tooltips: {
                enabled: true
            }
        }
    });
}






