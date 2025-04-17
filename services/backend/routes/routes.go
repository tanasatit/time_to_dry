package routes

import (
	"github.com/gorilla/mux"
	"backend/controllers"
)

func RegisterRoutes(r *mux.Router) {
	r.HandleFunc("/api/timetodry", controllers.GetTimeToDry).Methods("GET")
	r.HandleFunc("/api/tmd", controllers.GetTMD).Methods("GET")
	r.HandleFunc("/api/combined", controllers.GetCombinedData).Methods("GET")
	r.HandleFunc("/api/combined/populate", controllers.PopulateCombinedData).Methods("POST")
}