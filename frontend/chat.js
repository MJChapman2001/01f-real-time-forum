// open chat when click on user
function OpenChat(e, conn, data) {
    // document.querySelector(".user").style.fontWeight = "900"
    document.querySelector(".chat-wrapper").style.display = "flex"
    var msg = document.getElementById("chat-input");
    var log = document.querySelector(".chat")
    var rid = e.getAttribute('id')
    console.log(typeof +rid, +rid)

    log.innerHTML = ""

    function appendLog(container, msg, date) {
        var doScroll = log.scrollTop > log.scrollHeight - log.clientHeight - 1;
        log.appendChild(container);
        container.append(msg);
        msg.append(date)
       
        if (doScroll) {
            log.scrollTop = log.scrollHeight - log.clientHeight;
        }
    }



    document.querySelector("#send-btn").addEventListener("click", sendMsg)
    document.querySelector("#chat-input").addEventListener("keydown", function(event) {
        if (event.keyCode === 13) {
            sendMsg();
        }
    })

    function sendMsg() {
        if (!conn) {
            return false;
        }
        if (!msg.value) {
            return false;
        }
        // conn.send(msg.value);
        // send object with both ids and msg
        // get cookie id

        let msgData = {
            id: 0,
            sender_id: 0,
            receiver_id: +rid,
            content: msg.value,
            date: ''
        }

        conn.send(JSON.stringify(msgData))
        msg.value = "";
        return false;
    };

    data.map(({content, date}) => {
        var receiverContainer = document.createElement("div");
        receiverContainer.className = "receiver-container"
        var receiver = document.createElement("div");
        receiver.className = "receiver"
        receiver.innerText = content
        var date = document.createElement("div");
        date.className = "chat-time"
        date.innerText = "date+time"
        appendLog(receiverContainer, receiver, date);
    } )
};


// close chat
document.querySelector(".close-chat").addEventListener("click", function() {
    document.querySelector(".chat-wrapper").style.display = "none"
    // document.querySelector(".user").style.fontWeight = "400"

})