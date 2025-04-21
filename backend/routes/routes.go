package routes

import (
	"github.com/gorilla/mux"
	"backend/controllers"

	"github.com/swaggo/http-swagger"
	_ "backend/docs"
)

func RegisterRoutes(r *mux.Router) {
	r.HandleFunc("/api/timetodry", controllers.GetTimeToDry).Methods("GET")
	r.HandleFunc("/api/tmd", controllers.GetTMD).Methods("GET")
	r.HandleFunc("/api/tmd/today", controllers.TMDToday).Methods("GET")
	r.HandleFunc("/api/tmd/recent", controllers.TMDLast24Hours).Methods("GET")
	r.HandleFunc("/api/combined", controllers.GetCombinedData).Methods("GET")
	r.HandleFunc("/api/combined/populate", controllers.PopulateCombinedData).Methods("POST")

	r.HandleFunc("/api/ttd/latest", controllers.GetLatestTestID).Methods("GET")
	r.HandleFunc("/api/ttd/latest/all", controllers.GetAllRowsOfLatestTestID).Methods("GET")
	r.HandleFunc("/api/ttd/latest/last", controllers.GetLastRowOfLatestTestID).Methods("GET")
	r.HandleFunc("/api/ttd/status", controllers.CheckDeviceStatus).Methods("GET")

	r.HandleFunc("/api/forecast/rain", controllers.RainForecast).Methods("GET")

	r.PathPrefix("/swagger/").Handler(httpSwagger.WrapHandler)

}