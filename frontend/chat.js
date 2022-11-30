

let data = [{
    name: "Ricky",
    message: "test",
    date: "20/11/22",
    id: 1
}]


// open chat when click on user
document.querySelector(".user").addEventListener("click", function() {
    document.querySelector(".chat-wrapper").style.display = "flex"
    var conn;
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
        conn.send(msg.value);
        // send object with both ids and msg
        // get cookie id
        msg.value = "";
        return false;
    };

    if (window["WebSocket"]) {
        conn = new WebSocket("ws://" + document.location.host + "/ws");
        conn.onclose = function (evt) {
            // var item = document.createElement("div");
            // item.innerHTML = "<b>Connection closed.</b>";
            // appendLog(item);
        };

        data.map(({name,message, date, id}) => {
            var receiverContainer = document.createElement("div");
            receiverContainer.className = "receiver-container"
            var receiver = document.createElement("div");
            receiver.className = "receiver"
            receiver.innerText = message
            var date = document.createElement("div");
            date.className = "chat-time"
            date.innerText = "date+time"
            appendLog(receiverContainer, receiver, date);
        } )
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
});


// close chat
document.querySelector(".close-chat").addEventListener("click", function() {
    document.querySelector(".chat-wrapper").style.display = "none"

})