package controllers

import (
	"encoding/json"
	"net/http"
	"sort"
	"time"
	"log"

	"backend/database"
	"backend/models"
	"backend/utils"
)

func GetTimeToDry(w http.ResponseWriter, r *http.Request) {
	var data []models.TimeToDry
	database.DB.Find(&data)
	json.NewEncoder(w).Encode(data)
}

func GetTMD(w http.ResponseWriter, r *http.Request) {
	var data []models.TMD
	database.DB.Find(&data)
	json.NewEncoder(w).Encode(data)
}

func GetCombinedData(w http.ResponseWriter, r *http.Request) {
	var data []models.CombinedData
	database.DB.Find(&data)
	json.NewEncoder(w).Encode(data)
}

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
