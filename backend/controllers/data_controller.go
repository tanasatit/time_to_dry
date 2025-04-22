package controllers

import (
	"encoding/json"
	"fmt"
	"log"
	"math"
	"net/http"
	"os"
	"sort"
	"strconv"
	"strings"
	"time"

	"backend/database"
	"backend/models"
	"backend/utils"

	"github.com/joho/godotenv"
	"gorm.io/gorm"
)

// GetTimeToDry godoc
// @Summary Get all time_to_dry records
// @Description Returns all sensor records from the time_to_dry table.
// @Tags TimeToDry
// @Produce json
// @Success 200 {array} models.TimeToDry
// @Router /api/timetodry [get]
func GetTimeToDry(w http.ResponseWriter, r *http.Request) {
	var data []models.TimeToDry
	database.DB.Find(&data)
	json.NewEncoder(w).Encode(data)
}

// GetTMD godoc
// @Summary Get all tmd records
// @Description Returns all Weather API from tmd table.
// @Tags TMD
// @Produce json
// @Success 200 {array} models.TMD
// @Router /api/tmd [get]
func GetTMD(w http.ResponseWriter, r *http.Request) {
	var data []models.TMD
	database.DB.Find(&data)
	json.NewEncoder(w).Encode(data)
}

// TMDToday godoc
// @Summary Get today's TMD records
// @Description Returns all weather data from the TMD table for today.
// @Tags TMD
// @Produce json
// @Success 200 {array} models.TMD
// @Router /api/tmd/today [get]
func TMDToday(w http.ResponseWriter, r*http.Request) {
	now := time.Now()
	startOfDay := time.Date(now.Year(), now.Month(), now.Day(), 0, 0, 0, 0, now.Location())
	endOfDay := startOfDay.Add(24 * time.Hour)

	var data []models.TMD
	result := database.DB.Where("timestamp BETWEEN ? AND ?", startOfDay.Format("2006-01-02 15:04:05"), endOfDay.Format("2006-01-02 15:04:05")).Find(&data)

	if result.Error != nil {
		http.Error(w, "Failed to fetch TMD data", http.StatusInternalServerError)
		return
	}
	
	json.NewEncoder(w).Encode(data)
}

// TMDLast24Hours godoc
// @Summary Get last 24 hours of TMD data (latest 8 rows)
// @Description Returns the 8 most recent weather data records from the TMD table within the last 24 hours.
// @Tags TMD
// @Produce json
// @Success 200 {array} models.TMD
// @Router /api/tmd/recent [get]
func TMDLast24Hours(w http.ResponseWriter, r *http.Request) {
	now := time.Now()
	past24 := now.Add(-24 * time.Hour)

	var data []models.TMD
	result := database.DB.
		Where("timestamp >= ?", past24.Format("2006-01-02 15:04:05")).
		Order("timestamp desc").
		Limit(8).
		Find(&data)

	if result.Error != nil {
		http.Error(w, "Failed to fetch recent TMD data", http.StatusInternalServerError)
		return
	}

	json.NewEncoder(w).Encode(data)
}


// GetCombinedData godoc
// @Summary Get all combined records
// @Description Returns all Weather API from tmd table.
// @Tags CombinedData
// @Produce json
// @Success 200 {array} models.CombinedData
// @Router /api/combined [get]
func GetCombinedData(w http.ResponseWriter, r *http.Request) {
	var data []models.CombinedData
	database.DB.Find(&data)
	json.NewEncoder(w).Encode(data)
}

// GetLatestTestID godoc
// @Summary Get the latest test_id
// @Description Returns the highest test_id from time_to_dry table. ex.GET http://localhost:8080/api/ttd/status/check?test_id=5
// @Tags Test
// @Produce json
// @Success 200 {object} map[string]int
// @Router /api/ttd/latest [get]
func GetLatestTestID(w http.ResponseWriter, r *http.Request) {
	var latest models.TimeToDry
	result := database.DB.Order("test_id desc").First(&latest)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			http.Error(w, "No records found", http.StatusNotFound)
		} else {
			http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		}
		return
	}
	json.NewEncoder(w).Encode(map[string]int{"latest_test_id": latest.TestID})
}

// GetAllRowsOfLatestTestID godoc
// @Summary Get all rows of latest test_id
// @Description Returns all time_to_dry rows that share the latest test_id.
// @Tags Test
// @Produce json
// @Success 200 {array} models.TimeToDry
// @Router /api/ttd/latest/all [get]
func GetAllRowsOfLatestTestID(w http.ResponseWriter, r *http.Request) {
	var latest models.TimeToDry
	if err := database.DB.Order("test_id desc").First(&latest).Error; err != nil {
		http.Error(w, "No records found", http.StatusNotFound)
		return
	}

	var rows []models.TimeToDry
	database.DB.Where("test_id = ?", latest.TestID).Find(&rows)
	json.NewEncoder(w).Encode(rows)
}

// GetLastRowOfLatestTestID godoc
// @Summary Get the most recent row of latest test_id
// @Description Returns the latest time_to_dry row (by timestamp) for the latest test_id.
// @Tags Test
// @Produce json
// @Success 200 {object} models.TimeToDry
// @Router /api/ttd/latest/last [get]
func GetLastRowOfLatestTestID(w http.ResponseWriter, r *http.Request) {
	var latest models.TimeToDry
	if err := database.DB.Order("test_id desc").First(&latest).Error; err != nil {
		http.Error(w, "No records found", http.StatusNotFound)
		return
	}

	var last models.TimeToDry
	database.DB.Where("test_id = ?", latest.TestID).Order("timestamp desc").First(&last)
	json.NewEncoder(w).Encode(last)
}

// CheckDeviceStatus godoc
// @Summary Check device status
// @Description Returns whether the device is active (sending data within last 5 minutes).
// @Tags Device
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Router /api/ttd/status [get]
func CheckDeviceStatus(w http.ResponseWriter, r *http.Request) {
	var latest models.TimeToDry
	if err := database.DB.Order("timestamp desc").First(&latest).Error; err != nil {
		http.Error(w, "No recent record found", http.StatusNotFound)
		return
	}
	timestamp, err := utils.ParseTimestamp(latest.Timestamp)
	if err != nil {
		http.Error(w, "Invalid timestamp format", http.StatusInternalServerError)
		return
	}

	// Check if the latest timestamp is within last 5 minutes
	isWorking := time.Since(timestamp) <= 5*time.Minute
	json.NewEncoder(w).Encode(map[string]any{
		"is_working": isWorking,
		"latest_test_id": latest.TestID,
		"last_timestamp": latest.Timestamp,
	})
}

// CheckTestStatus godoc
// @Summary Check specific test status
// @Description Returns whether a given test_id is still collecting data or completed.
// @Tags Test
// @Produce json
// @Param test_id query int true "Test ID to check"
// @Success 200 {object} map[string]interface{}
// @Failure 400 {string} string "Missing or invalid test_id"
// @Failure 404 {string} string "No records found"
// @Router /api/ttd/status/check [get]
func CheckTestStatus(w http.ResponseWriter, r *http.Request) {
	query := r.URL.Query().Get("test_id")
	if query == "" {
		http.Error(w, "Missing test_id parameter", http.StatusBadRequest)
		return
	}

	var latest models.TimeToDry
	result := database.DB.Where("test_id = ?", query).Order("timestamp desc").First(&latest)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			http.Error(w, "No records found for given test_id", http.StatusNotFound)
		} else {
			http.Error(w, result.Error.Error(), http.StatusInternalServerError)
		}
		return
	}

	timestamp, err := utils.ParseTimestamp(latest.Timestamp)
	if err != nil {
		http.Error(w, "Invalid timestamp format", http.StatusInternalServerError)
		return
	}

	// Compare timestamp to now
	status := "completed"
	if time.Since(timestamp) <= 5*time.Minute {
		status = "in_progress"
	}

	json.NewEncoder(w).Encode(map[string]any{
		"test_id":        latest.TestID,
		"status":         status,
		"last_timestamp": latest.Timestamp,
	})
}


// PopulateCombinedData godoc
// @Summary Populate combined_data from time_to_dry and tmd
// @Description Matches closest timestamp from tmd for each time_to_dry record and inserts combined row if not duplicate.
// @Tags CombinedData
// @Accept json
// @Produce plain
// @Success 200 {string} string "Combined data populated"
// @Router /api/combined/populate [post]
func PopulateCombinedData(w http.ResponseWriter, r *http.Request) {
	var timeData []models.TimeToDry
	var tmdData []models.TMD
	database.DB.Find(&timeData)
	database.DB.Find(&tmdData)

	log.Printf("Found %d time_to_dry records\n", len(timeData))
	log.Printf("Found %d tmd records\n", len(tmdData))

	// Sort TMD by time for faster closest lookup
	sort.Slice(tmdData, func(i, j int) bool {
		t1, _ := utils.ParseTimestamp(tmdData[i].Timestamp)
		t2, _ := utils.ParseTimestamp(tmdData[j].Timestamp)
		return t1.Before(t2)
	})

	for _, td := range timeData {
		tdTime, err := utils.ParseTimestamp(td.Timestamp)
		if err != nil {
			log.Println("Failed to parse TimeToDry timestamp:", td.Timestamp)
			continue
		}

		var closest *models.TMD
		var minDiff time.Duration = time.Hour * 24

		for _, tmd := range tmdData {
			tmdTime, err := utils.ParseTimestamp(tmd.Timestamp)
			if err != nil {
				log.Println("Failed to parse TMD timestamp:", tmd.Timestamp)
				continue
			}
			diff := tdTime.Sub(tmdTime)
			if diff < 0 {
				diff = -diff
			}
			if diff < minDiff {
				minDiff = diff
				closest = &tmd
			}
		}

		// Add log to show matches or skips
		if closest != nil && minDiff < 3*time.Hour {
			log.Printf("Matched %s with %s (diff: %v)\n", td.Timestamp, closest.Timestamp, minDiff)
			
			var existing models.CombinedData
			formattedTimestamp := tdTime.Format("2006-01-02 15:04:05")
			result := database.DB.Where("timestamp = ? AND test_id = ?", formattedTimestamp, td.TestID).First(&existing)

			if result.RowsAffected == 0 {
				database.DB.Create(&models.CombinedData{
					Timestamp:   formattedTimestamp,
					Lat:         td.Lat,
					Lon:         td.Lon,
					TempIn:      td.TempIn,
					TempOut:     td.TempOut,
					HumIn:       td.HumIn,
					HumOut:      td.HumOut,
					DiffTemp:    td.DiffTemp,
					DiffHum:     td.DiffHum,
					TestID:      td.TestID,
					APITemp:     closest.Temperature,
					APIHumidity: closest.Humidity,
					Rainfall:    closest.Rainfall,
					CreatedAt:   time.Now().Format("2006-01-02 15:04:05"),
				})
				log.Printf("Inserted new combined entry for %s (test_id: %d)", td.Timestamp, td.TestID)
			} else {
				log.Printf("Skipped duplicate entry for %s (test_id: %d)", td.Timestamp, td.TestID)
			}

		} else {
			log.Printf("No match found for %s (closest diff: %v)\n", td.Timestamp, minDiff)
		}
	}

	w.Write([]byte("Combined data populated"))
}

// RainForecast godoc
// @Summary Estimate if it's currently raining or likely to rain
// @Description Uses current weather data to estimate rainfall based on weather description.
// @Tags Forecast
// @Produce json
// @Success 200 {object} map[string]interface{}
// @Router /api/forecast/rain [get]
func RainForecast(w http.ResponseWriter, r *http.Request) {
	err := godotenv.Load(".env")
	if err != nil {
		http.Error(w, "Failed to load .env", http.StatusInternalServerError)
		return
	}

	apiKey := os.Getenv("OWM_API_KEY")
	lat := os.Getenv("LAT")
	lon := os.Getenv("LON")

	url := fmt.Sprintf("https://api.openweathermap.org/data/2.5/weather?lat=%s&lon=%s&units=metric&appid=%s", lat, lon, apiKey)

	resp, err := http.Get(url)
	if err != nil || resp.StatusCode != 200 {
		http.Error(w, "Failed to fetch weather data", http.StatusInternalServerError)
		return
	}
	defer resp.Body.Close()

	var data map[string]interface{}
	json.NewDecoder(resp.Body).Decode(&data)

	// Check weather[].main or description
	willRain := false
	if weatherArray, ok := data["weather"].([]interface{}); ok && len(weatherArray) > 0 {
		condition := weatherArray[0].(map[string]interface{})
		main := strings.ToLower(condition["main"].(string))
		desc := strings.ToLower(condition["description"].(string))

		// Basic keyword check
		if strings.Contains(main, "rain") || strings.Contains(desc, "rain") ||
			strings.Contains(desc, "shower") || strings.Contains(desc, "thunder") {
			willRain = true
		}
	}

	// Line notification
	if willRain {
		err := utils.PushLineMessage("☔ It might rain soon. Take your clothes inside or Don't dry them now!", os.Getenv("LINE_USER_ID"))
		log.Println("Try to send line")
		if err != nil {
			log.Println("Failed to send LINE alert:", err)
		}
	}
	

	json.NewEncoder(w).Encode(map[string]interface{}{
		"will_rain_now_or_soon": willRain,
		"source":                data["weather"],
	})
}


// EstimateDryTime godoc
// @Summary Estimate drying time
// @Description Estimate drying time in minutes using sensor variables
// @Tags Drying
// @Produce json
// @Param temp_in query float64 true "Internal temperature"
// @Param temp_out query float64 true "External temperature"
// @Param hum_in query float64 true "Internal humidity"
// @Param hum_out query float64 true "External humidity"
// @Param light query float64 true "Light intensity"
// @Success 200 {object} map[string]interface{}
// @Router /api/drytime/estimate [get]
func EstimateDryTime(w http.ResponseWriter, r *http.Request) {
	q := r.URL.Query()

	tempIn, _ := strconv.ParseFloat(q.Get("temp_in"), 64)
	tempOut, _ := strconv.ParseFloat(q.Get("temp_out"), 64)
	humIn, _ := strconv.ParseFloat(q.Get("hum_in"), 64)
	humOut, _ := strconv.ParseFloat(q.Get("hum_out"), 64)
	light, _ := strconv.ParseFloat(q.Get("light"), 64)

	diffTemp := tempIn - tempOut
	diffHum := humIn - humOut

	// 🔧 Empirical coefficients
	base := 180.0 // base dry time in minutes
	a, b, c := 5.0, 1.5, 0.0015

	// Estimate formula
	estimatedTime := base - (a * diffTemp) - (b * diffHum) - (c * light)
	if estimatedTime < 10 {
		estimatedTime = 10 // Minimum dry time
	}

	json.NewEncoder(w).Encode(map[string]interface{}{
		"estimated_drying_time_minutes": math.Round(estimatedTime),
		"inputs": map[string]float64{
			"temp_in":  tempIn,
			"temp_out": tempOut,
			"hum_in":   humIn,
			"hum_out":  humOut,
			"light":    light,
		},
	})
}
