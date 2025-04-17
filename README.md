
---
# 🧺 Time to Dry

**Time to Dry** is a smart drying assistant that helps users determine optimal conditions for drying clothes. It leverages real-time environmental sensor data and weather forecasts to estimate drying times, send rain alerts, and provide recommendations — ensuring your laundry dries efficiently and stays safe from surprise rains.

---

## 🚀 Features

- 🌡️ **Real-Time Drying Estimates**  
  Estimate drying time based on temperature, humidity, and sunlight.

- 🌧️ **Rain Alerts**  
  Instant notifications if rain is predicted in your area.

- ☀️ **Drying Recommendations**  
  Tips based on sensor data and forecasts for best drying conditions.

- 📈 **Drying Statistics**  
  Historical tracking of drying conditions and times.

---

## 📡 Data Sources

### 📍 Primary Sensors (via KidBright microcontroller):
- **KY-028** – Temperature Sensor
- **KY-015** – Humidity Sensor
- **KY-018** – Light Intensity Sensor

### 🌦️ Secondary Data Sources:
- Weather API (via Node-RED)  
  Provides temperature, humidity, and rain forecasts.
- Scientific research data on drying condition thresholds.

---

## 🛠️ Tech Stack

| Layer         | Tech                   |
|---------------|------------------------|
| Frontend      | [Next.js](https://nextjs.org/)              |
| Backend       | [Go (Golang)](https://golang.org/)          |
| Microcontroller | KidBright (with Node-RED integration)      |
| Database      | MySQL / phpMyAdmin     |

---

## 📁 Project Structure

```
/frontend         → Next.js web app
/backend          → Go-based API service
/database         → SQL schema & data (phpMyAdmin)
/node-red         → Weather API integration scripts
/docs             → Diagrams, API reference, planning
```

---

## ⚙️ Getting Started

### 1. Clone the repo

```bash
git clone https://github.com/tanasatit/time_to_dry.git
cd time-to-dry
```

### 2. Set up the backend (Go)

```bash
cd backend
go run main.go
```

Make sure Go is installed: https://golang.org/doc/install

### 3. Set up the frontend (Next.js)

```bash
cd frontend
npm install
npm run dev
```

Make sure Node.js and npm are installed: https://nodejs.org/

### 4. Set up database

- Use phpMyAdmin to import SQL schemas and seed data.
- Tables:
  - `time_to_dry` (Sensor Data)
  - `tmd` (Weather API Data)
  - `combined_data` (Combined data for analysis)


---

## 📊 Sensor Data Fields

| Sensor        | Field Name       | Units        |
|---------------|------------------|--------------|
| KY-028        | temperature       | °C           |
| KY-015        | humidity          | % RH         |
| KY-018        | light_intensity   | Lux          |

---

## 📚 Research-Based Thresholds

| Parameter      | Optimal Range          |
|----------------|------------------------|
| Temperature    | 25°C - 35°C            |
| Humidity       | 30% - 50%              |
| Light Intensity| > 15,000 Lux           |


---

## 🧠 Authors & Credits

- **Sensors & Microcontroller** – KidBright platform
- **Backend & APIs** – Go
- **Frontend UI** – Next.js
- **Weather Data** – [OpenWeatherMap](https://openweathermap.org/) or equivalent API
- **Diagrams & Logic** – Eat Metal Everyday Team

---

## 📜 License

MIT License

---

## 📷 Screenshots

Screenshot place-holder

---

```
