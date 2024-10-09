import React, { useState, useEffect } from "react";
import { Card, Typography } from "antd";

const { Title, Text } = Typography;

const BinnenTemperatuurKaart = () => {
    const [temperatureData, setTemperatureData] = useState(null);
    const [currentTime, setCurrentTime] = useState("");

    const fetchLatestTemperature = async () => {
        try {
            const response = await fetch(
                "http://192.168.0.76:5000/api/BinnenTemperatuur"
            );
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();

            if (data && data.length > 0) { // Ensure the data is not empty
                const latestData = data[data.length - 1]; // Get the latest entry
                setTemperatureData(latestData);
            } else {
                console.warn("No data returned from the API.");
            }
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
            {temperatureData ? (
                <Card style={{ borderRadius: "16px", textAlign: "center" }}>
                    <Title level={3}>Kantoor</Title>
                    <Text style={{ fontSize: "24px" }}>{currentTime}</Text>
                    <Title style={{ fontSize: "48px", margin: "16px 0" }}>
                        {temperatureData.binnentemperatuur
                            ? temperatureData.binnentemperatuur.toFixed(1) + "°"
                            : "N/A"}
                    </Title>
                </Card>
            ) : (
                <Text>Loading temperature data...</Text>
            )}
        </div>
    );
};

export default BinnenTemperatuurKaart;
