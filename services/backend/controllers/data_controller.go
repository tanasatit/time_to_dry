package controllers

import (
	"encoding/json"
	"net/http"
	"sort"
	"time"

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

	sort.Slice(tmdData, func(i, j int) bool {
		t1, _ := utils.ParseTimestamp(tmdData[i].Timestamp)
		t2, _ := utils.ParseTimestamp(tmdData[j].Timestamp)
		return t1.Before(t2)
	})

	for _, td := range timeData {
		tdTime, err := utils.ParseTimestamp(td.Timestamp)
		if err != nil {
			continue
		}
		var closest *models.TMD
		var minDiff time.Duration = time.Hour * 24
		for _, tmd := range tmdData {
			tmdTime, err := utils.ParseTimestamp(tmd.Timestamp)
			if err != nil {
				continue
			}
			diff := tdTime.Sub(tmdTime)
			if diff < 0 {
				diff = -diff
			}
			if diff < minDiff && diff < (90*time.Minute) {
				minDiff = diff
				closest = &tmd
			}
		}
		if closest != nil {
			database.DB.Create(&models.CombinedData{
				Timestamp:   td.Timestamp,
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
		}
	}
	w.Write([]byte("Combined data populated"))
}