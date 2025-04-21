package utils

import (
	"log"
	"os"

	"github.com/line/line-bot-sdk-go/v7/linebot"
)

func PushLineMessage(message string, userID string) error {
	bot, err := linebot.New(
		os.Getenv("LINE_CHANNEL_SECRET"),
		os.Getenv("LINE_CHANNEL_TOKEN"),
	)
	if err != nil {
		log.Println("Failed to create LINE bot client:", err)
		return err
	}

	_, err = bot.PushMessage(userID, linebot.NewTextMessage(message)).Do()
	if err != nil {
		log.Println("Failed to push LINE message:", err)
		return err
	}

	log.Println("✅ LINE message sent successfully")
	return nil
}
