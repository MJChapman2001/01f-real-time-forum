package models

type Login struct {
	Data string `json:"emailUsername"`
	Password string `json:"password"`
}