const postsWrapper = document.querySelector('.posts-wrapper');
const createPost = document.querySelector(".create-post-wrapper");
const postContainer = document.querySelector(".post-container");
const contentWrapper = document.querySelector('.content-wrapper');
const registerWrapper = document.querySelector('.register-wrapper');
const signinContainer = document.querySelector('.signin-container');
const signupNav = document.querySelector('.signup-nav');
const logoutNav = document.querySelector('.logout-nav');

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

//sign in
document.querySelector('.signin-btn').addEventListener("click", function() {
    // e.preventDefault()
    const emailUsername = document.querySelector('#email-username').value
    const signinPassword = document.querySelector('#signin-password').value
    let data = {
        emailUsername: emailUsername,
        password: signinPassword
    }
    console.log("login: ", data)
    signinContainer.style.display = "none"
    signupNav.style.display = "none"
    contentWrapper.style.display = "flex"  
    logoutNav.style.display = "flex"
})


// sign up
document.querySelector('.signup-btn').addEventListener("click", function() {
    signinContainer.style.display = "none"
    registerWrapper.style.display = "flex"

})

// new post button
document.querySelector(".new-post-btn").addEventListener("click", function() {
    postsWrapper.style.display = "none"
    postContainer.style.display = "none"
    createPost.style.display = "flex"
})

// create post
document.querySelector(".create-post-btn").addEventListener("click", function() {
    const title = document.querySelector("#create-post-title").value
    const body = document.querySelector("#create-post-body").value
    const category = document.querySelector("#create-post-categories").value
    let data = {
        title: title,
        body: body,
        category: category
    }
    console.log("create post:", data)
    createPost.style.display = "none"
    postsWrapper.style.display = "flex"
})

// click on post
document.querySelector(".post").addEventListener("click", function() {
    postsWrapper.style.display = "none"
    postContainer.style.display = "flex"
})


document.querySelector(".logo").addEventListener("click", function() {
    createPost.style.display = "none"
    postContainer.style.display = "none"
    postsWrapper.style.display = "flex"
})


// register
document.querySelector(".register-btn").addEventListener("click", function(e) {
    e.preventDefault()

    const fname = document.querySelector("#fname").value
    const lname = document.querySelector("#lname").value
    const email = document.querySelector("#email").value
    const username = document.querySelector("#register-username").value
    const age = document.querySelector("#age").value
    const gender = document.querySelector("#gender").value
    const password = document.querySelector("#register-password").value

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

    console.log(resp)

    // registerWrapper.style.display = "none"
    // contentWrapper.style.display = "flex"  
})


document.querySelector(".send-comment-btn").addEventListener("click", function() {
    let comment = document.querySelector("#write-comment").value
    data = {
        comments: comment
    }
    document.querySelector("#write-comment").value = ""
    console.log("comments:", data)
}) 