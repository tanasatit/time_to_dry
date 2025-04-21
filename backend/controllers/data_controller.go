package controllers

import (
	"encoding/json"
	"log"
	"net/http"
	"sort"
	"time"

	"backend/database"
	"backend/models"
	"backend/utils"

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
// @Description Returns the highest test_id from time_to_dry table.
// @Tags Test
// @Produce json
// @Success 200 {object} map[string]int
// @Router /api/test/latest [get]
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
// @Router /api/test/latest/all [get]
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
// @Router /api/test/latest/last [get]
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
// @Router /api/test/status [get]
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
