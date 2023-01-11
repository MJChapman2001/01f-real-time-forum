const postsContainer = document.querySelector('.posts-container');
const createPostContainer = document.querySelector(".create-post-container");
const postContainer = document.querySelector(".post-container");
const contentWrapper = document.querySelector('.content-wrapper');
const registerContainer = document.querySelector('.register-container');
const signinContainer = document.querySelector('.signin');
const signupNav = document.querySelector('.signup-nav');
const logoutNav = document.querySelector('.logout-nav');
const onlineUsers = document.querySelector('.online-users');
const offlineUsers = document.querySelector('.offline-users');
const commentsContainer = document.querySelector('.comments-container');
const topPanel = document.querySelector('.top-panel');
const newPostNotif= document.querySelector('.new-post-notif-wrapper');
const msgNotif = document.querySelector(".msg-notification");

let counter = 0
var unread = []

var conn;
var currId = 0
var currUsername = ""
var currPost = 0

var allPosts = []
var filteredPosts = []

var allUsers = []
var online = []

var currComments = []

//POST fetch function
async function postData(url = '', data = {}) {
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    console.log('posted')

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

async function getComments(post_id) {
    await getData('http://localhost:8000/comment?param=post_id&data='+post_id)
    .then(value => {
        currComments = value
    }).catch(err => {
        console.log(err)
    })
}

async function updateUsers() {
    await getData('http://localhost:8000/chat?user_id='+currId)
    .then(value => {
        var newUsers = []

        if (value.user_ids != null) {
            newUsers = value.user_ids.map((i) => {
                return allUsers.filter(u => {return u.id == i})[0]
            })
        }

        let otherUsers = allUsers.filter(x => !newUsers.includes(x))

        allUsers = newUsers.concat(otherUsers)

        createUsers(allUsers, conn)
    }).catch(err => {
        console.log(err)
    })
}

function startWS() {
    if (window["WebSocket"]) {
        conn = new WebSocket("ws://" + document.location.host + "/ws");
        conn.onclose = function (evt) {
            // var item = document.createElement("div");
            // item.innerHTML = "<b>Connection closed.</b>";
            // appendLog(item);
        };

        conn.onmessage = async function (evt) {
            newMsg = JSON.parse(evt.data)
            console.log(newMsg)
            
            if (newMsg.msg_type == "msg") {
                var senderContainer = document.createElement("div");
                senderContainer.className = (newMsg.sender_id == currId) ? "sender-container": "receiver-container"
                var sender = document.createElement("div");
                sender.className = (newMsg.sender_id == currId) ? "sender": "receiver"
                sender.innerText = newMsg.content
                var date = document.createElement("div");
                date.className = "chat-time"
                date.innerText = (newMsg.date).slice(0, -3)
                appendLog(senderContainer, sender, date);

                if (newMsg.sender_id == currId) {
                    return
                }

                let unreadMsgs = unread.filter((u) => {
                    id = newMsg.sender_id
                    return u[0] == id
                })

                if (document.querySelector('.chat-wrapper').style.display == "none") {
                    if (unreadMsgs.length == 0) {
                        unread.push([newMsg.sender_id, 1])
                    } else {
                        unreadMsgs[0][1] += 1
                    }
                }

                updateUsers()
            } else if (newMsg.msg_type == "online") {
                online = newMsg.user_ids
                await getUsers()

                updateUsers()
            } else if (newMsg.msg_type == "post") {
                newPostNotif.style.display = "flex"
            }
        };
    } else {
        var item = document.createElement("div");
        item.innerHTML = "<b>Your browser does not support WebSockets.</b>";
        appendLog(item);
    }
}

window.addEventListener('DOMContentLoaded', async function() {
    await getPosts()
    await getUsers()

    document.querySelector('.chat-wrapper').style.display = "none"

    let sess = postData('http://localhost:8000/session')
    sess.then(value => {
        let vals = value.msg.split("|")
        currId = parseInt(vals[0])
        currUsername = vals[1]

        signinContainer.style.display = "none"
        signupNav.style.display = "none"
        contentWrapper.style.display = "flex"  
        logoutNav.style.display = "flex"

        document.querySelector('.profile').innerText = currUsername
        startWS()

        createPosts(allPosts)
        updateUsers()
    }).catch(() => {
        signinContainer.style.display = "flex"
        signupNav.style.display = "flex"
        contentWrapper.style.display = "none"  
        logoutNav.style.display = "none"
    })
})

function createPost(postdata) {

    document.querySelector('#title').innerHTML = postdata.title
    document.querySelector('#username').innerHTML = allUsers.filter(u => {return u.id == postdata.user_id})[0].username
    document.querySelector('#date').innerHTML = (postdata.date).slice(0, -3)
    document.querySelector('.category').innerHTML = postdata.category
    document.querySelector('.full-content').innerHTML = postdata.content
    document.getElementById('post-likes').innerHTML = postdata.likes
    document.getElementById('post-dislikes').innerHTML = postdata.dislikes
}

function createComments(commentsdata) {
    commentsContainer.innerHTML = ""
    if (commentsdata == null) {
        return
    }

    commentsdata.map(({id, post_id, user_id, content, date}) =>{
        var commentWrapper = document.createElement("div");
        commentWrapper.className = "comment-wrapper"
        commentsContainer.appendChild(commentWrapper)
        var userImg = document.createElement("img");
        userImg.src = "./frontend/assets/profile7.svg"
        commentWrapper.appendChild(userImg)
        var comment = document.createElement("div");
        comment.className = "comment"
        commentWrapper.appendChild(comment)
        var commentUserWrapper = document.createElement("div");
        commentUserWrapper.className = "comment-user-wrapper"
        comment.appendChild(commentUserWrapper)
        var commentUsername = document.createElement("div");
        commentUsername.className = "comment-username"
        commentUsername.innerText = allUsers.filter(u => {return u.id == user_id})[0].username
        commentUserWrapper.appendChild(commentUsername)
        var commentDate = document.createElement("div");
        commentDate.className = "comment-date"
        commentDate.innerHTML = date.slice(0, -3)
        commentUserWrapper.appendChild(commentDate)
        var commentSpan = document.createElement("div");
        commentSpan.innerHTML = content
        comment.appendChild(commentSpan)
    })
}

function createPosts(postdata) {
    postsContainer.innerHTML = ""

    if (postdata == null) {
        return
    }

    postdata.map(async ({id, user_id, category, title, content, date, likes, dislikes}) => {
        await getComments(id)

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
        img.src = "./frontend/assets/profile7.svg"
        author.appendChild(img)
        var user = document.createElement("div");
        user.className = "post-username"
        user.innerHTML = allUsers.filter(u => {return u.id == user_id})[0].username
        author.appendChild(user)
        var postdate = document.createElement("div");
        postdate.className = "date"
        postdate.innerText = date.slice(0, -3)
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
        comment.innerText = (currComments === null) ? "0 Comments" : currComments.length + " Comments"
        comments.appendChild(comment)

        post.addEventListener("click", async function(e) {
            currPost = parseInt(post.getAttribute("id"))

            await getComments(currPost)

            createPost(allPosts.filter(p => {return p.id == currPost})[0])
            createComments(currComments)
            document.getElementById('post-comments').innerHTML = (currComments === null) ? "0 Comments" : currComments.length + " Comments"
        
            postsContainer.style.display = "none"
            postContainer.style.display = "flex"
            topPanel.style.display = "none"
        })
    })
}

function createUsers(userdata, conn) {
    onlineUsers.innerHTML = ""
    offlineUsers.innerHTML = ""

    if (userdata == null) {
        return
    }

    userdata.map(({id, username}) => {
        if (id == currId) {
            return
        }

        var user = document.createElement("div");
        user.className = "user"
        user.setAttribute("id", ('id'+id))

        if (online.includes(id)) {
            onlineUsers.appendChild(user)
        } else {
            offlineUsers.appendChild(user)
        }

        var userImg = document.createElement("img");
        userImg.src = "./frontend/assets/profile4.svg"
        user.appendChild(userImg)
        var chatusername = document.createElement("p");
        chatusername.innerText = username
        user.appendChild(chatusername)
        var msgNotification = document.createElement("div");
        msgNotification.className = "msg-notification"
        msgNotification.innerText = 1
        user.appendChild(msgNotification)

        let unreadMsgs = unread.filter((u) => {
            return u[0] == id
        })

        if (unreadMsgs.length != 0 && unreadMsgs[0][1] != 0) {
            const msgNotif =  document.getElementById('id'+id).querySelector('.msg-notification');
            msgNotif.style.opacity = "1"
            msgNotif.innerText = unreadMsgs[0][1]
            
            document.getElementById('id'+id).style.fontWeight = "900"
        } 

        user.addEventListener("click", function(e) {
            let resp = getData('http://localhost:8000/message?receiver='+id)
            resp.then(value => {
                // let rid = parseInt(user.getAttribute("id"))
                let ridStr = user.getAttribute("id")
                const regex = /id/i;
                const rid = parseInt(ridStr.replace(regex, ''))
                console.log("rid", rid)
                counter = 0
                document.getElementById('id'+id).querySelector(".msg-notification").style.opacity = "0"
                OpenChat(rid, conn, value, currId)
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

document.getElementById("categories").onchange = function () {
    let val = document.getElementById("categories").value

    if (val == "all") {
        createPosts(allPosts)
        return
    }

    filteredPosts = allPosts.filter((i) => {
        console.log(i.category)
        return i.category == val
    })
    console.log(filteredPosts)
    createPosts(filteredPosts)
}

document.getElementById("like-btn").addEventListener("click", () => {
    let resp = postData('http://localhost:8000/like?post_id='+currPost+'&col=likes')
    resp.then(value => {
        let vals = value.msg.split("|")
        document.getElementById('post-likes').innerHTML = parseInt(vals[0])
        document.getElementById('post-dislikes').innerHTML = parseInt(vals[1])
    }).catch()
})

document.getElementById("dislike-btn").addEventListener("click", () => {
    let resp = postData('http://localhost:8000/like?post_id='+currPost+'&col=dislikes')
    resp.then(value => {
        let vals = value.msg.split("|")
        document.getElementById('post-likes').innerHTML = parseInt(vals[0])
        document.getElementById('post-dislikes').innerHTML = parseInt(vals[1])
    }).catch()
})

//Sign in
document.querySelector('.signin-btn').addEventListener("click", async function() {
    await getPosts()
    await getUsers()

    // e.preventDefault()
    const emailUsername = document.querySelector('#email-username').value
    const signinPassword = document.querySelector('#signin-password').value
    let data = {
        emailUsername: emailUsername,
        password: signinPassword
    }
    
    let resp = postData('http://localhost:8000/login', data)
    resp.then(value => {
        let vals = value.msg.split("|")
        currId = parseInt(vals[0])
        currUsername = vals[1]

        document.querySelector('.profile').innerText = currUsername

        signinContainer.style.display = "none"
        signupNav.style.display = "none"
        contentWrapper.style.display = "flex"
        logoutNav.style.display = "flex"

        document.querySelector('#email-username').value = ""
        document.querySelector('#signin-password').value = ""

        startWS()

        createPosts(allPosts)
        updateUsers()
    })
})

//Sign up/Sign in button + link
document.querySelector('#signup-link').addEventListener('click', function() {
    signinContainer.style.display = "none"
    registerContainer.style.display = "block"
    signupBtn.innerText = "SIGN IN";
})

document.querySelector('#signin-link').addEventListener('click', function() {
    signinContainer.style.display = "flex"
    registerContainer.style.display = "none"
    signupBtn.innerText = "SIGN UP";
})

const signupBtn = document.querySelector('.signup-btn')
signupBtn.addEventListener("click", function() {

    if (signupBtn.innerText === "SIGN UP") {
        signupBtn.innerText = "SIGN IN";
        signinContainer.style.display = "none"
        registerContainer.style.display = "block"
    } else {
        signupBtn.innerText = "SIGN UP";
        signinContainer.style.display = "flex"
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
        signinContainer.style.display = "flex"  
    })
})

//New post button
document.querySelector(".new-post-btn").addEventListener("click", function() {
    postsContainer.style.display = "none"
    postContainer.style.display = "none"
    createPostContainer.style.display = "flex"
    topPanel.style.display = "none"
    const title = document.querySelector("#create-post-title").value = ""
    const body = document.querySelector("#create-post-body").value = ""

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
    resp.then(async value => {
        msg = value.msg

        await getPosts()
        createPosts(allPosts)

        sendMsg(conn, 0, {value: "New Post"}, 'post')

        createPostContainer.style.display = "none"
        postsContainer.style.display = "flex"
        topPanel.style.display = "flex"
        
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
        id: 0,
        post_id: currPost,
        user_id: currId,
        content: comment,
        date: ""
    }
    console.log(commentsdata)
    
    let resp = postData('http://localhost:8000/comment', commentsdata)
    resp.then(async () => {
        document.querySelector("#comment-input").value = ""

        await getComments(currPost)
        document.getElementById('post-comments').innerHTML = (currComments === null) ? "0 Comments" : currComments.length + " Comments"
        createComments(currComments)
    })
}


//Go back to home page when click on logo + back button
document.querySelector(".logo").addEventListener("click", home)
document.querySelector(".back").addEventListener("click", home)
document.querySelector("#back-btn").addEventListener("click", home)

async function home() {
    selectCategories = document.getElementById("categories");
    selectCategories.selectedIndex = 0;

    await getPosts()
    createPosts(allPosts)

    createPostContainer.style.display = "none"
    postContainer.style.display = "none"
    postsContainer.style.display = "flex"
    topPanel.style.display = "flex"
    newPostNotif.style.display = "none"
}

newPostNotif.addEventListener('click', async function() {
    
    await getPosts()
    createPosts(allPosts)
    newPostNotif.style.display = "none"
    window.scrollTo(0, 0);
});

function closeWS() {
    if (conn.readyState === WebSocket.OPEN) {
        conn.close()
    }
}

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

        closeWS()
    })
})