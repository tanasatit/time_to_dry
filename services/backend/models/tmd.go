package models

type TMD struct {
	ID         uint    `gorm:"primaryKey" json:"id"`
	Timestamp  string  `json:"timestamp"`
	Temperature float64 `json:"temperature"`
	Humidity    float64 `json:"humidity"`
	Rainfall    float64 `json:"rainfall"`
}