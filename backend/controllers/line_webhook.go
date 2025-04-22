package controllers

import (
	"fmt"
	"net/http"
	"os"

	"github.com/line/line-bot-sdk-go/v7/linebot"
)

// LineWebhook handles incoming messages from LINE users.
func LineWebhook(w http.ResponseWriter, r *http.Request) {
	bot, err := linebot.New(
		os.Getenv("LINE_CHANNEL_SECRET"),
		os.Getenv("LINE_CHANNEL_TOKEN"),
	)
	if err != nil {
		http.Error(w, "Bot setup failed", http.StatusInternalServerError)
		return
	}

	events, err := bot.ParseRequest(r)
	if err != nil {
		http.Error(w, "Parse error", http.StatusBadRequest)
		return
	}

	for _, event := range events {
		if event.Type == linebot.EventTypeMessage {
			switch msg := event.Message.(type) {
			case *linebot.TextMessage:
				reply := fmt.Sprintf("You said: %s", msg.Text)
				if _, err := bot.ReplyMessage(event.ReplyToken, linebot.NewTextMessage(reply)).Do(); err != nil {
					fmt.Println("Reply error:", err)
				}
			}
		}
	}
}
