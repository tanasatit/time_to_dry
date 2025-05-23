package models

type CombinedData struct {
	ID          uint    `gorm:"primaryKey" json:"id"`
	Timestamp   string  `json:"timestamp"`
	Lat         float64 `json:"lat"`
	Lon         float64 `json:"lon"`
	TempIn      float64 `json:"temp_in"`
	TempOut     float64 `json:"temp_out"`
	HumIn       float64 `json:"hum_in"`
	HumOut      float64 `json:"hum_out"`
	DiffTemp    float64 `json:"diff_temp"`
	DiffHum     float64 `json:"diff_hum"`
	TestID      int     `json:"test_id"`
	APITemp     float64 `json:"api_temp"`
	APIHumidity float64 `json:"api_humidity"`
	Rainfall    float64 `json:"rainfall"`
	CreatedAt   string  `json:"created_at"`
}

func (CombinedData) TableName() string {
	return "combined_data"
}