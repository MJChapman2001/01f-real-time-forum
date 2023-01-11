package models


type OnlineUsers struct {
	UserIds []int `json:"user_ids"`
	Msg_type string `json:"msg_type"`
}