
function OpenChat(rid, conn, data, currId) {
    // document.querySelector(".user").style.fontWeight = "900"
    document.querySelector(".chat-username-wrapper p").innerText = allUsers[rid-1].username
    const msgNotification = document.querySelector(".msg-notification");
    msgNotification.style.opacity = "0"
    document.querySelector(".chat-wrapper").style.display = "flex"
    var msg = document.getElementById("chat-input");
    var log = document.querySelector(".chat")

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
            receiver_id: rid,
            content: msg.value,
            date: ''
        }

        conn.send(JSON.stringify(msgData))
        msg.value = "";
        return false;
    };

    if (data == null) {
        return
    }

    data.map(({sender_id, content, date}) => {
        var receiverContainer = document.createElement("div");
        receiverContainer.className = (sender_id == currId) ? "sender-container": "receiver-container"
        var receiver = document.createElement("div");
        receiver.className = (sender_id == currId) ? "sender": "receiver"
        receiver.innerText = content
        var messagedate = document.createElement("div");
        messagedate.className = "chat-time"
        messagedate.innerText = date
        appendLog(receiverContainer, receiver, messagedate);
    } )
};


// close chat
document.querySelector(".close-chat").addEventListener("click", function() {
    document.querySelector(".chat-wrapper").style.display = "none"
    // document.querySelector(".user").style.fontWeight = "400"

})