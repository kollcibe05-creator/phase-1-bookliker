const ul = document.getElementById("list")
const showPanel = document.getElementById("show-panel")
let Books = []


fetch("http://localhost:3000/books")
.then(r => r.json())
.then(books => {
    Books = books
    makeTitleLists(Books)
})
.catch(err => console.error(err))

function makeTitleLists (books) {
    books.forEach(book => makeTitle(book))
}

function makeTitle(book) {
    const li = document.createElement("li")
    li.id = book.id
    li.textContent = book.title

    ul.appendChild(li)


    li.addEventListener("click", () => {
        fetchBook(li.id)
    })
}


function fetchBook(id) {
    fetch(`http://localhost:3000/books/${id}`)
    .then(r => r.json())
    .then(book => renderBook(book))
}
function renderBook(book) {
    const likers = book.users
    showPanel.innerHTML = ''
    const fragment = document.createDocumentFragment()

    const image = document.createElement("img")
    image.alt = book.title
    image.src = book.img_url
    fragment.append(image)

    let h1 = document.createElement("h1")
    h1.textContent = book.title
    fragment.append(h1)

    let h2 = document.createElement("h2")
    h2.textContent = book.subtitle
    fragment.append(h2)

    let author = document.createElement("h2")
    author.textContent = book.author
    fragment.append(author)
    
    const p = document.createElement("p")
    p.textContent = book.description
    fragment.append(p)

    const ul = document.createElement("ul")
    
    makeUsersList(likers, ul)
    

    fragment.append(ul)

    const button = document.createElement("button")
    button.textContent = "LIKE"
    fragment.append(button)

    let likeState = button.textContent === "LIKE"
    
    showPanel.append(fragment)

    button.addEventListener("click", (e) => {
        likeState = !likeState
        target = e.target
        handleLike(likeState, ul, book, target)
    })
    
}
function makeUsersList(likers, ul) {
    ul.innerHTML = ''
    likers.forEach(liker => {
        const li = document.createElement("li")
        li.textContent = liker.username
        ul.appendChild(li)
    })
    
}


function handleLike (likeState, ul, book, button) {
    

    button.textContent = likeState ? "UNLIKE" : "LIKE"

    if (likeState === true) {
        const likers = book.users
        likers.push({
            username: "zoog_collo"
        })

        const patchObj = {
            users: likers
        }
        fetch(`http://localhost:3000/books/${book.id}`, {
            method: "PATCH", 
            headers: {
                "Content-Type": "application/json", 
                "Accept": "application/json"
            }, 
            body: JSON.stringify(patchObj)
        })
        .then(r => r.json())
        .then(data => makeUsersList(data.users, ul))
        .catch(err => console.error(err))
    }else{
         const likers = book.users
        likers.pop()
        

        const patchObj = {
            users: likers
        }
        fetch(`http://localhost:3000/books/${book.id}`, {
            method: "PATCH", 
            headers: {
                "Content-Type": "application/json", 
                "Accept": "application/json"
            }, 
            body: JSON.stringify(patchObj)
        })
        .then(r => r.json())
        .then(data => makeUsersList(data.users, ul))
        .catch(err => console.error(err))

    }
}