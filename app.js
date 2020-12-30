
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
var myChart = null;
var scatterChart = null;

async function searchUser() {
    const user = loginForm.username.value;
    const authorisation = loginForm.password.value !== "" ? loginForm.password.value : undefined;

    if(chart2 != null) chart2.destroy();
    if(chart3 != null) chart3.destroy();
    if(myChart != null) myChart.destroy();
    if(scatterChart != null) scatterChart.destroy();
    chart2 == null;
    chart3 == null;
    myChart == null;
    scatterChart == null;

    let info = await loadData(user, authorisation)
    theUser = info;
    authO = authorisation;
    if(info.name != null) {
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
        
    } else {
        private_repos.innerHTML = `<b>Private Repos: Authentication Required</b>`;
        total_repos.innerHTML = `<b>Total Repos: Authentication Required</b>`;
        //get_commits_polarArea(info.public_repos, user, authorisation);
        let repo = await getPrivateRepos(user, undefined)
        makePie(repo, user, undefined);   
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
    
    let times = [];
    let backgroundColor = [];
    var days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    let theDays = [];
    //let theData = [[],[]];
    let finalData = [];
    
    for(i in repoInfo.items) {
        let commits = await getMostReposCommits(user, token, repoInfo.items[i].name);
        let date1 = new Date(commits[0].commit.author.date);
        let date2 = new Date(commits[commits.length-1].commit.author.date);
        leanTime = date1.getTime() - date2.getTime();
        leanDays +=  leanTime / (1000 * 3600 * 24);
        //Scatter Plot
        ////////////////////////////////////
        for (j in commits) {
            let date = commits[j].commit.author.date;
            
            var d = new Date(date);
            let day = days[d.getDay()];

            let theTime = d.getHours();
            //times[d.getDay()].push(theTime);
            // backgroundColor.push(`rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`);
            console.log("hey");

            //theDays.push(day);
            theDays.push(d.getDay());
            times.push(theTime);
            backgroundColor.push(`rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 0.2)`);


            ////
            finalData.push({
                x: d.getDay()+1,
                y: theTime
            });
            
        }



        ///////////////////////////////
    }
    finalData.push({
        x: 0,
        y: 0
    });
    finalData.push({
        x: 8,
        y: 0
    });

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

    // makeScatter('scatter', 'scatter', 'languages', "Scatter Plot of Commits Per Day (Apt)", theDays, times, backgroundColor);
    makeScatter('scatter', 'scatter', 'languages', "Scatter Plot of Commits Per Day (Apt)", theDays, finalData, backgroundColor);
}

async function makeScatter(ctx, type, datasetLabel, titleText, label, data, backgroundColor) {

    let aChart = document.getElementById(ctx).getContext('2d');
    scatterChart = new Chart(aChart, {
        type: 'scatter',
        data: {
            datasets: [{
                //label: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
                label: 'Data Points',
                data: data
            }]
        },
        options: {
            scales: {
                xAxes: [{
                    type: 'linear',
                    position: 'bottom'
                }]
            }
        }
    });
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
        if(chart2 != null) chart2.destroy();
        if(chart3 != null) chart3.destroy();
        if(myChart != null) myChart.destroy();
        if(scatterChart != null) scatterChart.destroy();
        chart2 == null;
        chart3 == null;
        myChart == null;
        scatterChart == null;
        loadingIconStart();
  
    } else {
        loginErrorMsg.style.opacity = 1;
        loginErrorSuc.style.opacity = 0;
        if(chart2 != null) chart2.destroy();
        if(chart3 != null) chart3.destroy();
        if(myChart != null) myChart.destroy();
        if(scatterChart != null) scatterChart.destroy();
        chart2 == null;
        chart3 == null;
        myChart == null;
        scatterChart == null;
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
    grid = document.getElementById('wholeThing');
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
    grid = document.getElementById('wholeThing');
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

async function getMostReposCommits(user, token, name) {
    let url = `https://api.github.com/repos/${user}/${name}/commits?per_page=600`;
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
            // title: {
            //     display: true,
            //     text: titleText,
            //     fontSize: 20
            // },
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
        // title: {
        //   display: true,
        //   text: details.label,
        // }

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