package api

import (
	"log"
	"net/http"

	"real-time-forum/internal/chat"
	"real-time-forum/internal/config"
	"real-time-forum/internal/database"
)

//Sets up the router with endpoints and starts the server
func StartServer() {
	database.InitDB(config.Path)

	mux := http.NewServeMux()
	hub := chat.NewHub()
	go hub.Run()

	mux.Handle("/frontend/", http.StripPrefix("/frontend/", http.FileServer(http.Dir("./frontend"))))

	mux.HandleFunc("/", HomeHandler)
	mux.HandleFunc("/session", SessionHandler)
	mux.HandleFunc("/login", LoginHandler)
	mux.HandleFunc("/logout", LogoutHandler)
	mux.HandleFunc("/register", RegisterHandler)
	mux.HandleFunc("/user", UserHandler)
	mux.HandleFunc("/post", PostHandler)
	mux.HandleFunc("/message", MessageHandler)
	mux.HandleFunc("/comment", CommentHandler)
	mux.HandleFunc("/like", LikeHandler)
	mux.HandleFunc("/chat", ChatHandler)
	mux.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		chat.ServeWs(hub, w, r)
	})

	if err := http.ListenAndServe(":8000", mux); err != nil {
		log.Fatal(err)
	}
}
