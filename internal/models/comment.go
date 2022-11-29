package models

type Comment struct {
	Id int `json:"id"`
	Post_id int `json:"post_id"`
	User_id int `json:"user_id"`
	Content string `json:"content"`
	Date string `json:"date"`
	Likes int `json:"likes"`
	Dislikes int `json:"dislikes"`
}