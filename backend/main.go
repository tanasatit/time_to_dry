// @title Time To Dry API
// @version 1.0
// @description This is the backend API for the Time to Dry project.
// @host localhost:8080
// @BasePath /

package main

import (
	"log"
	"net/http"
	"time"

	"backend/config"
	"backend/database"
	"backend/routes"
	"backend/middleware"

	"github.com/gorilla/mux"
)

func main() {
	config.LoadEnvVariables()
	database.Connect()

	r := mux.NewRouter()
	routes.RegisterRoutes(r)
	handler := middleware.CORS(r) 

	srv := &http.Server{
		Handler:      handler,
		Addr:         ":8080",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Println("Server started on http://localhost:8080")
	log.Fatal(srv.ListenAndServe())
	
}