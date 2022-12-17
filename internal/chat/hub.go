package chat

import (
	"encoding/json"

	"real-time-forum/internal/models"
)

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// Registered clients.
	clients map[int]*Client

	// Inbound messages from the clients.
	broadcast chan []byte

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client
}

func NewHub() *Hub {
	return &Hub{
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		// clients:    make(map[*Client]bool),
		clients: make(map[int]*Client),
	}
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			// h.clients[client] = true
			h.clients[client.userID] = client

			var uids []int

			for i, _ := range h.clients {
				uids = append(uids, i)
			}

			var msg =  models.OnlineUsers{
				UserIds: uids,
				Msg_type: "online",
			}

			sendMsg, err := json.Marshal(msg)
			if err != nil {
				panic(err)
			}

			for _, c := range h.clients {
				select {
				case c.send <- sendMsg:
				default:
					close(c.send)
					delete(h.clients, c.userID)
				}
			}
		case client := <-h.unregister:
			if _, ok := h.clients[client.userID]; ok {
				delete(h.clients, client.userID)

				var uids []int

				for i, _ := range h.clients {
					uids = append(uids, i)
				}

				var msg =  models.OnlineUsers{
					UserIds: uids,
					Msg_type: "online",
				}
	
				sendMsg, err := json.Marshal(msg)
				if err != nil {
					panic(err)
				}
	
				for _, c := range h.clients {
					select {
					case c.send <- sendMsg:
					default:
						close(c.send)
						delete(h.clients, c.userID)
					}
				}
				close(client.send)
			}
		case message := <-h.broadcast:
			// insert message and ids to database
			var msg models.Message

			if err := json.Unmarshal(message, &msg); err != nil {
				panic(err)
			}

			sendMsg, err := json.Marshal(msg)
			if err != nil {
				panic(err)
			}

			if msg.Msg_type == "msg" {
				for _, client := range h.clients {
					if (client.userID == msg.Receiver_id) {
						select {
						case client.send <- sendMsg:
						default:
							close(client.send)
							delete(h.clients, client.userID)
						}
					}
				}
			} else {
				for _, client := range h.clients {
					if client.userID != msg.Sender_id {
						select {
						case client.send <- sendMsg:
						default:
							close(client.send)
							delete(h.clients, client.userID)
						}
					}
				}
			}
		}
	}
}