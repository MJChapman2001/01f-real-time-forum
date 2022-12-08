package api

import (
	"encoding/json"
	"net/http"
	"strconv"
	
	"real-time-forum/internal/config"
	"real-time-forum/internal/database"
	"real-time-forum/internal/models"
)

func MessageHandler(w http.ResponseWriter, r *http.Request) {
	//Prevents the endpoint being called by other url paths
	if r.URL.Path != "/message" {
		http.Error(w, "404 not found.", http.StatusNotFound)
		return
	}

	//Checks whether it is a POST or GET request
	switch r.Method {
	case "GET":
		cookie, err := r.Cookie("session")
		if err != nil {
			return
		}

		foundVal := cookie.Value

		curr, err := database.CurrentUser(config.Path, foundVal)
		if err != nil {
			return
		}

		s:= strconv.Itoa(curr.Id)

		//Grabs the receiver id from the url
		r := r.URL.Query().Get("receiver")

		//Makes sure neither are empty
		if  r == "" {
			http.Error(w, "400 bad request", http.StatusBadRequest)
			return
		}

		//Gets the messages from the database
		messages, err := database.FindChatMessages(config.Path, s, r)
		if err != nil {
			http.Error(w, "500 internal server error", http.StatusInternalServerError)
			return
		}

		//Marshals the array of message structs to a json object
		resp, err := json.Marshal(messages)
		if err != nil {
			http.Error(w, "500 internal server error", http.StatusInternalServerError)
			return
		}

		//Writes the json object to the frontend
		w.WriteHeader(http.StatusOK)
		w.Write(resp)
	case "POST":
		var newMessage models.Message

		//Decodes the request body into the message struct
		//Returns a bad request if there's an error
		err := json.NewDecoder(r.Body).Decode(&newMessage)
		if err != nil {
			http.Error(w, "400 bad request.", http.StatusBadRequest)
			return
		}

		//Attemps to add the new message to the database
		err = database.NewMessage(config.Path, newMessage)
		if err != nil {
			http.Error(w, "500 internal server error", http.StatusInternalServerError)
			return
		}
	default:
		//Prevents the use of other request types
		http.Error(w, "405 method not allowed", http.StatusMethodNotAllowed)
		return
	}
}