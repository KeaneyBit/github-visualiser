//console.log("Hey there")
//window.alert("What's up")

function searchUser() {

    var user = document.getElementById("username").value !== "" ? document.getElementById("user").value : 'Keaneyjo';
    var authorisation = document.getElementById("authorisation").value !== "" ? document.getElementById("token").value : undefined;
    if(user === undefined) {
        alert("bad job lad");
    } else main(user, authorisation);
}

const divResult = document.getElementById("divResult")

async function main(user, token) {
    //let url = `https://api.github.com/users/${user}/repos`;
    let url = `https://api.github.com/users/${user}`;
    //let response = await fetch(url)
    //const result = await response.json()

    //
    const headers = {
        'Authorization': `Token ${token}`
    }

    const response = (token == undefined) ? await fetch(url) : await fetch(url, {
        "method": "GET",
        "headers": headers
    });

    let data = await response.json();
    //

    let img = document.getElementById('img');
    
    img.src = data.avatar_url
    alert(img.src)
    //getRepos()
    //getCommits()



    
}

async function getRepos() {
    //clear();
    const url = "https://api.github.com/search/repositories?q=stars:150000..300000"
    const response = await fetch(url)
    const result = await response.json()

    

    result.items.forEach(i=>{

        const anchor = document.createElement("a")
        anchor.href = i.html_url;
        anchor.textContent = i.full_name;
        

        const img = document.createElement("img")
        img.src = i.author.avatar_url;
        img.style.width="32px"
        img.style.height="32px"

        divResult.appendChild(anchor)
        divResult.appendChild(img)
        divResult.appendChild(document.createElement("br"))



    })

}

async function getCommits(url="https://api.github.com/search/commits?q=repo:freecodecamp/freecodecamp author-date:2019-03-01..2019-03-31") {
        //clear();
        
        const headers = {
            "Accept" : "application/vnd.github.cloak-preview"
        }
        const response = await fetch(url, {
            "method" : "GET",
            "headers" : headers
        })
        //"<https://api.github.com/search/commits?q=repo%3Afreecodecamp%2Ffreecodecamp+author-date%3A2019-03-01..2019-03-31&page=2>; rel="next", <https://api.github.com/search/commits?q=repo%3Afreecodecamp%2Ffreecodecamp+author-date%3A2019-03-01..2019-03-31&page=27>; rel="last""

        const link = response.headers.get("link")
        const links = link.split(",")
        const urls = links.map(a=> {
            return {
                url: a.split(";")[0].replace(">","").replace("<",""),
                title:a.split(";")[1]
            }

        })
        const result = await response.json()

        result.items.forEach(i=>{
            const img = document.createElement("img")
            img.src = i.author.avatar_url;
            img.style.width="32px"
            img.style.height="32px"
            const anchor = document.createElement("a")
            anchor.href = i.html_url;
            anchor.textContent = i.commit.message.substr(0,120) + "...";
            divResult.appendChild(img)
            divResult.appendChild(anchor)
            divResult.appendChild(document.createElement("br"))


        })


        urls.forEach(u => {
            const btn = document.createElement("button")
            btn.textContent = u.title;
            btn.addEventListener("click", e=> getCommits(u.url))
            divResult.appendChild(btn);
        })

    }



