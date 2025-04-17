package utils

import "time"

func ParseTimestamp(ts string) (time.Time, error) {
	layout := "2006-01-02 15:04:05"
	return time.Parse(layout, ts)
}