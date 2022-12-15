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

function CreateMessages(data, currId) {
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
}

function sendMsg(conn, rid, msg, msg_type) {
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
        date: '',
        msg_type: msg_type
    }

    conn.send(JSON.stringify(msgData))
    msg.value = "";
    return false;
};
// open chat when click on user
function OpenChat(rid, conn, data, currId) {
    // document.querySelector(".user").style.fontWeight = "900"
    document.querySelector(".chat-wrapper").style.display = "flex"
    var msg = document.getElementById("chat-input");

    log.innerHTML = ""

    document.querySelector("#send-btn").addEventListener("click", sendMsg)
    document.querySelector("#chat-input").addEventListener("keydown", function(event) {
        if (event.keyCode === 13) {
            sendMsg(conn, rid, msg, 'msg');

            let resp = getData('http://localhost:8000/message?receiver='+rid)
            resp.then(value => {
                CreateMessages(value, currId)
            }).catch()
        }
    })

    if (data == null) {
        return
    }

    CreateMessages(data, currId)
};


// close chat
document.querySelector(".close-chat").addEventListener("click", function() {
    document.querySelector(".chat-wrapper").style.display = "none"
    // document.querySelector(".user").style.fontWeight = "400"

})