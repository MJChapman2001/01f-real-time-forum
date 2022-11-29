package models

type User struct {
	Id int `json:"id"`
	Username string `json:"username"`
	Firstname string `json:"firstname"`
	Surname string `json:"surname"`
	Gender string `json:"gender"`
	Email string `json:"email"`
	DOB string `json:"dob"`
	Password string `json:"password"`
}