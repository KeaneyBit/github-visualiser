function buttonPress() {
    console.log("Hey there")
    window.alert("What's up")

    main()
}

async function main() {
    const url = 'https://api.github.com/users/Keaneyjo/repos'

    const response = await fetch(url)
//6
    const result = await response.json()
    console.log(result)
}



