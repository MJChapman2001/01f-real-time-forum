package models

type Post struct {
	Id int `json:"id"`
	User_id int `json:"user_id"`
	Category string `json:"category"`
	Title string `json:"title"`
	Content string `json:"content"`
	Date string `json:"date"`
	Likes int `json:"likes"`
	Dislikes int `json:"dislikes"`
}