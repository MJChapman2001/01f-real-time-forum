const nav = document.querySelector('.nav-wrapper');
const leftPanel = document.querySelector('left-panel');
const midSection = document.querySelector('.mid-section');
const rightPanel = document.querySelector('right-panel');




const postsWrapper = document.querySelector('.posts-wrapper');
const createPost = document.querySelector(".create-post-wrapper");
const postContainer = document.querySelector(".post-container");
const contentWrapper = document.querySelector('.content-wrapper');
const registerWrapper = document.querySelector('.register-wrapper');
const signinContainer = document.querySelector('.signin-container');
const signupNav = document.querySelector('.signup-nav');
const logoutNav = document.querySelector('.logout-nav');



document.querySelector('.signin-btn').addEventListener("click", function() {
    // e.preventDefault()
   signinContainer.style.display = "none"
   signupNav.style.display = "none"
    contentWrapper.style.display = "flex"  
    logoutNav.style.display = "flex"
})

document.querySelector(".new-post-btn").addEventListener("click", function() {
    const title = document.querySelector("#create-post-title").value
    console.log(title)
    postsWrapper.style.display = "none"
    postContainer.style.display = "none"
    createPost.style.display = "flex"
})

document.querySelector(".create-post-btn").addEventListener("click", function() {
    createPost.style.display = "none"
    postsWrapper.style.display = "flex"
})

document.querySelector(".post").addEventListener("click", function() {
    postsWrapper.style.display = "none"
    postContainer.style.display = "flex"
})

document.querySelector(".logo").addEventListener("click", function() {
    createPost.style.display = "none"
    postContainer.style.display = "none"
    postsWrapper.style.display = "flex"
})

document.querySelector(".register-btn").addEventListener("click", function(e) {
    e.preventDefault()
    registerWrapper.style.display = "none"
    contentWrapper.style.display = "flex"  
})
