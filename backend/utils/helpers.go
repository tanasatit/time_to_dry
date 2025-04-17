package utils

import "time"

func ParseTimestamp(ts string) (time.Time, error) {
	// Try ISO 8601 format first
	if t, err := time.Parse(time.RFC3339, ts); err == nil {
		return t, nil
	}
	// Fallback to custom format if needed
	return time.Parse("2006-01-02 15:04:05", ts)
}
