const postsContainer = document.querySelector('.posts-container');
const createPostContainer = document.querySelector(".create-post-container");
const postContainer = document.querySelector(".post-container");
const contentWrapper = document.querySelector('.content-wrapper');
const registerContainer = document.querySelector('.register-container');
const signinContainer = document.querySelector('.signin-container');
const signupNav = document.querySelector('.signup-nav');
const logoutNav = document.querySelector('.logout-nav');
const users = document.querySelector('.users');

var conn;

var allPosts = []
var filteredPosts = []

var allUsers = []

//POST fetch function
async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })

    return response.json()
}

//GET fetch function
async function getData(url = '') {
    const response = await fetch(url, {
        method: 'GET'
    })

    return response.json()
}

async function getPosts() {
    await getData('http://localhost:8000/post')
    .then(value => {
        allPosts = value
    }).catch(err => {
        console.log(err)
    })
}

async function getUsers() {
    await getData('http://localhost:8000/user')
    .then(value => {
        allUsers = value
    }).catch(err => {
        console.log(err)
    })
}

window.addEventListener('DOMContentLoaded', async function() {
    await getPosts()
    await getUsers()

    var msg
    let sess = postData('http://localhost:8000/session')
    sess.then(value => {
        msg = value.msg
        console.log(msg)

        signinContainer.style.display = "none"
        signupNav.style.display = "none"
        contentWrapper.style.display = "flex"  
        logoutNav.style.display = "flex"

        document.querySelector('.profile').innerHTML = "username"
        if (window["WebSocket"]) {
            conn = new WebSocket("ws://" + document.location.host + "/ws");
            conn.onclose = function (evt) {
                // var item = document.createElement("div");
                // item.innerHTML = "<b>Connection closed.</b>";
                // appendLog(item);
            };

            conn.onmessage = function (evt) {
                var senderContainer = document.createElement("div");
                senderContainer.className = "sender-container"
                var sender = document.createElement("div");
                sender.className = "sender"
                sender.innerText = evt.data
                var date = document.createElement("div");
                date.className = "chat-time"
                date.innerText = "date+time"
                appendLog(senderContainer, sender, date);

            };
        } else {
            var item = document.createElement("div");
            item.innerHTML = "<b>Your browser does not support WebSockets.</b>";
            appendLog(item);
        }

        createPosts(allPosts)
        createUsers(allUsers, conn)
    }).catch(() => {
        signinContainer.style.display = "flex"
        signupNav.style.display = "flex"
        contentWrapper.style.display = "none"  
        logoutNav.style.display = "none"
    })
})

function createPost(postdata) {

    document.querySelector('#title').innerHTML = postdata.title
    document.querySelector('#username').innerHTML = postdata.user_id
    document.querySelector('#date').innerHTML = postdata.date
    document.querySelector('.category').innerHTML = postdata.category
    document.querySelector('.full-content').innerHTML = postdata.content
}

function createComments(commentsdata) {
    commentsdata.map(({Id, Post_id, User_id, Content, Date, Likes, Dislikes}) =>{
        var commentWrapper = document.createElement("div");
        commentWrapper.className = "comment-wrapper"
        postContainer.appendChild(commentWrapper)
        var userImg = document.createElement("img");
        userImg.src = "./frontend/assets/profile1.svg"
        commentWrapper.appendChild(userImg)
        var comment = document.createElement("div");
        comment.className = "comment"
        commentWrapper.appendChild(comment)
        var commentUser = document.createElement("div");
        commentUser.className = "comment-username"
        commentUser.innerText = User_id
        comment.appendChild(commentUser)
        var commentSpan = document.createElement("span");
        commentSpan.innerHTML = Content
        comment.appendChild(commentSpan)
    })
}

function createPosts(postdata) {
    postsContainer.innerHTML = ""

    if (postdata == null) {
        return
    }

    postdata.map(({id, user_id, category, title, content, date, likes, dislikes}) => {
        var post = document.createElement("div");
        post.className = "post"
        post.setAttribute("id", id)
        postsContainer.appendChild(post)
        var posttitle = document.createElement("div");
        posttitle.className = "title"
        posttitle.innerText = title
        post.appendChild(posttitle)
        var author = document.createElement("div");
        author.className = "author"
        post.append(author)
        var img = document.createElement("img");
        img.src = "./frontend/assets/profile1.svg"
        author.appendChild(img)
        var user = document.createElement("div");
        user.className = "post-username"
        user.innerHTML = allUsers[user_id-1].username
        author.appendChild(user)
        var postdate = document.createElement("div");
        postdate.className = "date"
        postdate.innerText = date
        author.appendChild(postdate)
        var postcontent = document.createElement("div");
        postcontent.className = "post-body"
        postcontent.innerText = content
        post.append(postcontent)  
        var commentsWrapper = document.createElement("div");
        commentsWrapper.className = "comments-wrapper"
        post.appendChild(commentsWrapper)
        var likesDislikesWrapper = document.createElement("div");
        likesDislikesWrapper.className = "likes-dislikes-wrapper"
        commentsWrapper.appendChild(likesDislikesWrapper)
        var likesWrapper = document.createElement("div");
        likesWrapper.className = "likes-wrapper"
        likesDislikesWrapper.appendChild(likesWrapper)
        var likesImg = document.createElement("img");
        likesImg.src = "./frontend/assets/like3.svg"
        likesWrapper.appendChild(likesImg)
        var postlikes = document.createElement("div");
        postlikes.className = "likes"
        postlikes.innerText = likes
        likesWrapper.appendChild(postlikes)
        var dislikesWrapper = document.createElement("div");
        dislikesWrapper.className = "likes-wrapper dislike"
        likesDislikesWrapper.appendChild(dislikesWrapper)
        var dislikesImg = document.createElement("img");
        dislikesImg.src = "./frontend/assets/dislike4.svg"
        dislikesWrapper.appendChild(dislikesImg)
        var postdislikes = document.createElement("div");
        postdislikes.className = "dislike"
        postdislikes.innerText = dislikes
        dislikesWrapper.appendChild(postdislikes)
        var comments = document.createElement("div");
        comments.className = "comments"
        commentsWrapper.appendChild(comments)
        var commentsImg = document.createElement("img");
        commentsImg.src = "./frontend/assets/comment.svg"
        comments.appendChild(commentsImg)
        var comment = document.createElement("div");
        comment.className = "comment"
        comment.innerText = "3" + " Comments"
        comments.appendChild(comment)

        post.addEventListener("click", function() {
            createPost(postdata[post.id])
            createComments(commentsdata)
        
            postsContainer.style.display = "none"
            postContainer.style.display = "flex"
        })
    })
}

function createUsers(userdata, conn) {
    users.innerHTML = ""

    userdata.map(({id, username}) => {
        var user = document.createElement("div");
        user.className = "user"
        user.setAttribute("id", id)
        users.appendChild(user)
        var userImg = document.createElement("img");
        userImg.src = "./frontend/assets/profile4.svg"
        user.appendChild(userImg)
        var chatusername = document.createElement("p");
        chatusername.innerText = username
        user.appendChild(chatusername)

        user.addEventListener("click", function(e) {
            let resp = getData('http://localhost:8000/message?receiver='+id)
            resp.then(value => {
                OpenChat(e.target, conn, value)
            }).catch()
        })
    })
}

var msg = document.getElementById("chat-input");
var log = document.querySelector(".chat")

function appendLog(container, msg, date) {
    var doScroll = log.scrollTop > log.scrollHeight - log.clientHeight - 1;
    log.appendChild(container);
    container.append(msg);
    msg.append(date)
   
    if (doScroll) {
        log.scrollTop = log.scrollHeight - log.clientHeight;
    }
}

//Sign in
document.querySelector('.signin-btn').addEventListener("click", async function() {
    document.querySelector('.profile').innerHTML = "username"

    await getPosts()
    await getUsers()

    // e.preventDefault()
    const emailUsername = document.querySelector('#email-username').value
    const signinPassword = document.querySelector('#signin-password').value
    let data = {
        emailUsername: emailUsername,
        password: signinPassword
    }
    
    var msg
    let resp = postData('http://localhost:8000/login', data)
    resp.then(value => {
        msg = value.msg
        console.log(msg)

        signinContainer.style.display = "none"
        signupNav.style.display = "none"
        contentWrapper.style.display = "flex"
        logoutNav.style.display = "flex"

        document.querySelector('#email-username').value = ""
        document.querySelector('#signin-password').value = ""

        createPosts(allPosts)
        createUsers(allUsers, conn)

        if (window["WebSocket"]) {
            conn = new WebSocket("ws://" + document.location.host + "/ws");
            conn.onclose = function (evt) {
                // var item = document.createElement("div");
                // item.innerHTML = "<b>Connection closed.</b>";
                // appendLog(item);
            };
    
            conn.onmessage = function (evt) {
                var senderContainer = document.createElement("div");
                senderContainer.className = "sender-container"
                var sender = document.createElement("div");
                sender.className = "sender"
                sender.innerText = evt.data
                var date = document.createElement("div");
                date.className = "chat-time"
                date.innerText = "date+time"
                appendLog(senderContainer, sender, date);
    
            };
        } else {
            var item = document.createElement("div");
            item.innerHTML = "<b>Your browser does not support WebSockets.</b>";
            appendLog(item);
        }
    })
})

//Sign up/Sign in button + link
document.querySelector('#signup-link').addEventListener('click', function() {
    signinContainer.style.display = "none"
    registerContainer.style.display = "block"
})
document.querySelector('#signin-link').addEventListener('click', function() {
    signinContainer.style.display = "block"
    registerContainer.style.display = "none"
})

const signupBtn = document.querySelector('.signup-btn')
signupBtn.addEventListener("click", function() {

    if (signupBtn.innerText === "SIGN UP") {
        signupBtn.innerText = "SIGN IN";
        signinContainer.style.display = "none"
        registerContainer.style.display = "block"
    } else {
        signupBtn.innerText = "SIGN UP";
        signinContainer.style.display = "block"
        registerContainer.style.display = "none"
    }
})

//Register
document.querySelector(".register-btn").addEventListener("click", function(e) {
    e.preventDefault()

    var msg = ""

    const fname = document.querySelector("#fname").value
    const lname = document.querySelector("#lname").value
    const email = document.querySelector("#email").value
    const username = document.querySelector("#register-username").value
    const age = document.querySelector("#age").value
    const gender = document.querySelector("#gender").value
    const password = document.querySelector("#register-password").value

    msg += (fname == "") ? "Enter a firstname. " : ""
    msg += (lname == "") ? "Enter a surname. " : ""
    msg += (email == "") ? "Enter a email. " : ""
    msg += (username == "") ? "Enter a username. " : ""
    msg += (age == "") ? "Enter a DOB. " : ""
    msg += (gender == "") ? "Enter a gender. " : ""
    msg += (password == "") ? "Enter a password. " : ""

    if (msg != "") {
        alert(msg)
        return
    }

    let data = {
        id: 0,
        username: username,
        firstname: fname,
        surname: lname,
        gender: gender,
        email: email,
        dob: age,
        password: password
    }

    let resp = postData('http://localhost:8000/register', data)
    resp.then(value => {
        msg = value.msg
        alert(msg)

        registerContainer.style.display = "none"
        signinContainer.style.display = "block"  
    })
})

//New post button
document.querySelector(".new-post-btn").addEventListener("click", function() {
    postsContainer.style.display = "none"
    postContainer.style.display = "none"
    createPostContainer.style.display = "flex"
})

//Create new post
document.querySelector(".create-post-btn").addEventListener("click", function() {
    const title = document.querySelector("#create-post-title").value
    const body = document.querySelector("#create-post-body").value
    const category = document.querySelector("#create-post-categories").value
    let data = {
        id: 0,
        user_id: 0,
        category: category,
        title: title,
        content: body,
        date: '',
        likes: 0,
        dislikes: 0
    }
    
    var msg
    let resp = postData('http://localhost:8000/post', data)
    resp.then(value => {
        msg = value.msg
        alert(msg)

        createPostContainer.style.display = "none"
        postsContainer.style.display = "flex"
    })
})

//Comments
document.querySelector(".send-comment-btn").addEventListener("click", sendComment)
document.querySelector("#comment-input").addEventListener("keydown", function(event) {
    if (event.keyCode === 13) {
        sendComment();
    }
})

function sendComment() {
    let comment = document.querySelector("#comment-input").value
    commentsdata = {
        Id: "id",
        Post_id: "postID",
        User_id: "userID",
        Content: comment,
        Date: "Date",
        Likes: "Likes",
        Dislikes: "Dislikes"
    }
    document.querySelector("#comment-input").value = ""
    console.log("comments:", commentsdata)
}


//Go back to home page when click on logo
document.querySelector(".logo").addEventListener("click", function() {
    createPostContainer.style.display = "none"
    postContainer.style.display = "none"
    postsContainer.style.display = "flex"
})

//Log Out
document.querySelector(".logout-btn").addEventListener("click", function() {
    var msg
    let resp = postData('http://localhost:8000/logout')
    resp.then(value => {
        msg = value.msg
        console.log(msg)

        signinContainer.style.display = "flex"
        registerContainer.style.display = "none"
        contentWrapper.style.display = "none"  
        signupNav.style.display = "flex"
        logoutNav.style.display = "none"
    })
})