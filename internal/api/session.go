package api

import (
	"encoding/json"
	"net/http"
	"strconv"

	"real-time-forum/internal/config"
	"real-time-forum/internal/database"
	"real-time-forum/internal/models"
)

func SessionHandler(w http.ResponseWriter, r *http.Request) {
	//Prevents the endpoint being called by other url paths
	if r.URL.Path != "/session" {
		http.Error(w, "404 not found.", http.StatusNotFound)
		return
	}
	
	//Prevents all request types other than POST
	if r.Method != "POST" {
		http.Error(w, "405 method not allowed.", http.StatusMethodNotAllowed)
		return
	}

	cookie, err := r.Cookie("session")
	if err != nil {
		return
	}

	foundVal := cookie.Value

	curr, err := database.CurrentUser(config.Path, foundVal)
	if err != nil {
		return
	}

	cid := strconv.Itoa(curr.Id)

	//Sends a message back if successfully logged in
	var msg = models.Resp{Msg: cid+"|"+curr.Username}
	
	resp, err := json.Marshal(msg)
	if err != nil {
		http.Error(w, "500 internal server error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(resp)
}