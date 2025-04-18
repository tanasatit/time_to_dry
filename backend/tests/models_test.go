package tests

import (
	"backend/database"
	"backend/models"
	"testing"
	"time"
	"github.com/joho/godotenv"
)

// setupModelTestDB connects to DB and cleans up afterward
func setupModelTestDB(t *testing.T) {
	err := godotenv.Load("../.env")
	if err != nil {
		t.Fatalf("Failed to load .env: %v", err)
	}
	database.Connect()

	t.Cleanup(func() {
		sqlDB, _ := database.DB.DB()
		sqlDB.Close()
	})
}

// TestTimeToDryCreate verifies a TimeToDry record can be created.
func TestTimeToDryCreate(t *testing.T) {
	setupModelTestDB(t)
	record := models.TimeToDry{
		Timestamp: time.Now().Format("2006-01-02 15:04:05"),
		Lat:       13.75,
		Lon:       100.5,
		TempIn:    30,
		TempOut:   32,
		HumIn:     85,
		HumOut:    80,
		DiffTemp:  -2,
		DiffHum:   5,
		TestID:    999,
		Light:     70,
	}
	result := database.DB.Create(&record)
	defer database.DB.Where("test_id = ?", record.TestID).Delete(&models.TimeToDry{})

	if result.Error != nil {
		t.Errorf("Failed to insert TimeToDry: %v", result.Error)
	}
}

// TestTMDCreate verifies a TMD (weather) record can be created.
func TestTMDCreate(t *testing.T) {
	setupModelTestDB(t)
	record := models.TMD{
		Timestamp:  time.Now().Format("2006-01-02 15:04:05"),
		Temperature: 33.5,
		Humidity:    70,
		Rainfall:    1.5,
	}
	result := database.DB.Create(&record)
	defer database.DB.Where("test_id = ?", record.ID).Delete(&models.TimeToDry{})

	if result.Error != nil {
		t.Errorf("Failed to insert TMD: %v", result.Error)
	}
}

// TestCombinedDataCreate verifies a CombinedData record can be inserted.
func TestCombinedDataCreate(t *testing.T) {
	setupModelTestDB(t)
	record := models.CombinedData{
		Timestamp:   time.Now().Format("2006-01-02 15:04:05"),
		Lat:         13.75,
		Lon:         100.5,
		TempIn:      30,
		TempOut:     32,
		HumIn:       85,
		HumOut:      80,
		DiffTemp:    -2,
		DiffHum:     5,
		TestID:      999,
		APITemp:     33.5,
		APIHumidity: 70,
		Rainfall:    1.5,
		CreatedAt:   time.Now().Format("2006-01-02 15:04:05"),
	}
	result := database.DB.Create(&record)
	defer database.DB.Where("test_id = ?", record.TestID).Delete(&models.TimeToDry{})

	if result.Error != nil {
		t.Errorf("Failed to insert CombinedData: %v", result.Error)
	}
}
