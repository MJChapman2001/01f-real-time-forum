package models

type Message struct {
	Id int `json:"id"`
	Sender_id int `json:"sender_id"`
	Receiver_id int `json:"receiver_id"`
	Content string `json:"content"`
	Date string `json:"date"`
	Msg_type string `json:"msg_type"`
}