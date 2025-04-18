package tests

import (
	"backend/controllers"
	"backend/database"
	"backend/models"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/joho/godotenv"
)

// setupTestDB loads .env and connects to DB
func setupTestDB(t *testing.T) {
	err := godotenv.Load("../.env") // adjust path based on your folder
	if err != nil {
		t.Fatalf("Failed to load .env file: %v", err)
	}
	database.Connect()

	t.Cleanup(func() {
		sqlDB, _ := database.DB.DB()
		sqlDB.Close()
	})
}

// TestGetLatestTestID verifies that the latest test_id is correctly retrieved.
func TestGetLatestTestID(t *testing.T) {
	setupTestDB(t)
	req := httptest.NewRequest("GET", "/api/test/latest", nil)
	w := httptest.NewRecorder()
	controllers.GetLatestTestID(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d", w.Code)
	}

	var res map[string]int
	err := json.Unmarshal(w.Body.Bytes(), &res)
	if err != nil {
		t.Fatal("response not JSON")
	}

	if _, ok := res["latest_test_id"]; !ok {
		t.Error("missing latest_test_id in response")
	}
}

// TestCheckDeviceStatus checks whether the device is reporting data within 5 minutes.
func TestCheckDeviceStatus(t *testing.T) {
	setupTestDB(t)
	req := httptest.NewRequest("GET", "/api/test/status", nil)
	w := httptest.NewRecorder()
	controllers.CheckDeviceStatus(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d", w.Code)
	}

	var res map[string]interface{}
	err := json.Unmarshal(w.Body.Bytes(), &res)
	if err != nil {
		t.Fatal("response not JSON")
	}

	if _, ok := res["is_working"]; !ok {
		t.Error("missing is_working field")
	}
}

// TestGetAllRowsOfLatestTestID checks if all rows of the latest test_id are returned.
func TestGetAllRowsOfLatestTestID(t *testing.T) {
	setupTestDB(t)
	req := httptest.NewRequest("GET", "/api/test/latest/all", nil)
	w := httptest.NewRecorder()
	controllers.GetAllRowsOfLatestTestID(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d", w.Code)
	}

	var data []models.TimeToDry
	err := json.Unmarshal(w.Body.Bytes(), &data)
	if err != nil {
		t.Fatal("response not valid JSON array")
	}
}

// TestGetLastRowOfLatestTestID checks if the last row of the most recent test_id is retrieved.
func TestGetLastRowOfLatestTestID(t *testing.T) {
	setupTestDB(t)
	req := httptest.NewRequest("GET", "/api/test/latest/last", nil)
	w := httptest.NewRecorder()
	controllers.GetLastRowOfLatestTestID(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d", w.Code)
	}

	var row models.TimeToDry
	err := json.Unmarshal(w.Body.Bytes(), &row)
	if err != nil {
		t.Fatal("response not a valid single row JSON")
	}

	if row.Timestamp == "" {
		t.Error("timestamp is empty in returned row")
	}
}

// TestGetTimeToDry checks if time_to_dry data can be retrieved.
func TestGetTimeToDry(t *testing.T) {
	setupTestDB(t)
	req := httptest.NewRequest("GET", "/api/timetodry", nil)
	w := httptest.NewRecorder()
	controllers.GetTimeToDry(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d", w.Code)
	}
}

// TestGetTMD checks if TMD (weather data) can be retrieved.
func TestGetTMD(t *testing.T) {
	setupTestDB(t)
	req := httptest.NewRequest("GET", "/api/tmd", nil)
	w := httptest.NewRecorder()
	controllers.GetTMD(w, req)

	if w.Code != http.StatusOK {
		t.Errorf("expected status 200, got %d", w.Code)
	}
}
