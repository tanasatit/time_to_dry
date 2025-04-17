package main

import (
	"log"
	"net/http"
	"time"

	"backend/config"
	"backend/database"
	"backend/routes"

	"github.com/gorilla/mux"
)

func main() {
	config.LoadEnvVariables()
	database.Connect()
	r := mux.NewRouter()
	routes.RegisterRoutes(r)

	srv := &http.Server{
		Handler:      r,
		Addr:         ":8080",
		WriteTimeout: 15 * time.Second,
		ReadTimeout:  15 * time.Second,
	}

	log.Println("Server started on port 8080")
	log.Fatal(srv.ListenAndServe())
}