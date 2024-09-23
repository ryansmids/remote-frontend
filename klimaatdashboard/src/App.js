import React, { useState, useEffect } from "react";
import { Card, Typography } from "antd";

const { Title, Text } = Typography;

function App() {
  const [temperatureData, setTemperatureData] = useState(null);
  const [currentTime, setCurrentTime] = useState("");

  // Functie om de nieuwste temperatuur op te halen
  const fetchLatestTemperature = async () => {
    try {
      const response = await fetch(
        "https://localhost:44373/api/BuitenTemperatuur"
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      const latestData = data[data.length - 1];
      setTemperatureData(latestData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Functie om de tijd te updaten
  const updateTime = () => {
    const now = new Date();
    const timeString = now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    setCurrentTime(timeString);
  };

  useEffect(() => {
    // Direct de temperatuur ophalen bij de eerste render
    fetchLatestTemperature();

    // Temperature fetch every 30 seconds
    const temperatureIntervalId = setInterval(fetchLatestTemperature, 30000);

    // Time update every second
    const timeIntervalId = setInterval(updateTime, 1000);

    // Clean up both intervals on component unmount
    return () => {
      clearInterval(temperatureIntervalId);
      clearInterval(timeIntervalId);
    };
  }, []);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      {temperatureData && (
        <Card style={{ width: 300, borderRadius: "16px", textAlign: "center" }}>
          <Title level={3}>{temperatureData.locatie}</Title>
          <Text style={{ fontSize: "24px" }}>{currentTime}</Text>
          <Title style={{ fontSize: "48px", margin: "16px 0" }}>
            {temperatureData.temperatuur}°
          </Title>
        </Card>
      )}
    </div>
  );
}

export default App;
