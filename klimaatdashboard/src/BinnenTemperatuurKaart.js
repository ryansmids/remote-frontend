import React, { useState, useEffect } from "react";
import { Card, Typography } from "antd";

const { Title, Text } = Typography;

const BinnenTemperatuurKaart = () => {
    const [temperatureData, setTemperatureData] = useState(null);
    const [currentTime, setCurrentTime] = useState("");

    const fetchLatestTemperature = async () => {
        try {
            const response = await fetch(
                "https://localhost:44373/api/BinnenTemperatuur"
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            const latestData = data[data.length - 1]; // Get the latest entry
            setTemperatureData(latestData);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    const updateTime = () => {
        const now = new Date();
        const timeString = now.toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
        });
        setCurrentTime(timeString);
    };

    useEffect(() => {
        fetchLatestTemperature();
        const temperatureIntervalId = setInterval(fetchLatestTemperature, 30000); // Fetch every 30 seconds
        const timeIntervalId = setInterval(updateTime, 1000); // Update time every second

        return () => {
            clearInterval(temperatureIntervalId);
            clearInterval(timeIntervalId);
        };
    }, []);

    return (
        <div>
            {temperatureData && (
                <Card style={{ borderRadius: "16px", textAlign: "center" }}>
                    <Title level={3}>Kantoor</Title>
                    <Text style={{ fontSize: "24px" }}>{currentTime}</Text>
                    <Title style={{ fontSize: "48px", margin: "16px 0" }}>
                        {temperatureData.temperatuur.toFixed(1)}° {/* Show 1 decimal */}
                    </Title>
                </Card>
            )}
        </div>
    );
};

export default BinnenTemperatuurKaart;
