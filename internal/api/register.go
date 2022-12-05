package api

import (
	"encoding/json"
	"net/http"

	"real-time-forum/internal/config"
	"real-time-forum/internal/database"
	"real-time-forum/internal/models"

	"golang.org/x/crypto/bcrypt"
)

func RegisterHandler(w http.ResponseWriter, r *http.Request) {
	//Prevents the endpoint being called by other url paths
	if r.URL.Path != "/register" {
		http.Error(w, "404 not found.", http.StatusNotFound)
		return
	}

	//Prevents all request types other than POST
	if r.Method != "POST" {
		http.Error(w, "405 method not allowed.", http.StatusMethodNotAllowed)
		return
	}

	//Stores the unmarshalled register data
	var newUser models.User
	
	//Decodes the request body into the user struct
	//Returns a bad request if there's an error
	err := json.NewDecoder(r.Body).Decode(&newUser)
	if err != nil {
		http.Error(w, "400 bad request.", http.StatusBadRequest)
		return
	}

	//Generate the password hash for the user
	passwordHash, err := GenerateHash(newUser.Password)
	if err != nil {
		http.Error(w, "500 internal server error.", http.StatusInternalServerError)
		return
	}

	newUser.Password = passwordHash

	//Attempts to add the new user to the database
	err = database.NewUser(config.Path, newUser)
	if err != nil {
		http.Error(w, "500 internal server error.", http.StatusInternalServerError)
		return
	}

	//Sends a message back if successfully registered
	var msg = models.Resp{Msg: "Successful registration"}
	
	resp, err := json.Marshal(msg)
	if err != nil {
		http.Error(w, "500 internal server error", http.StatusInternalServerError)
		return
	}

	w.WriteHeader(http.StatusOK)
	w.Write(resp)
}

//Generates a hash from a given password
func GenerateHash(password string) (string, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), 0)

	return string(hash), err
}