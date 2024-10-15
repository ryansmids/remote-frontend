import React, { useState, useEffect, useCallback } from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const TemperatureChartBinnen = () => {
    const [chartData, setChartData] = useState(null);

    // Genereer tijdlabels van 00:00 tot 23:59 in stappen van 15 minuten
    const generateTimeLabels = () => {
        const labels = [];
        for (let hour = 0; hour < 24; hour++) {
            labels.push(`${hour.toString().padStart(2, "0")}:00`);
            labels.push(`${hour.toString().padStart(2, "0")}:15`);
            labels.push(`${hour.toString().padStart(2, "0")}:30`);
            labels.push(`${hour.toString().padStart(2, "0")}:45`);
        }
        return labels;
    };

    // Functie om de data op te halen, met useCallback om te zorgen dat deze niet bij elke render opnieuw wordt aangemaakt
    const fetchTemperatureData = useCallback(() => {
        const today = new Date().toISOString().split("T")[0]; // Vandaag in formaat YYYY-MM-DD
        const yesterday = new Date(Date.now() - 864e5).toISOString().split("T")[0]; // Gisteren in hetzelfde formaat

        // API oproep om data op te halen
        fetch('http://192.168.0.76:5000/api/BinnenTemperatuur/')
            .then((response) => response.json())
            .then((data) => {
                const todayData = Array(96).fill(null); // Array van 96 waarden voor elke 15 minuten in een dag
                const yesterdayData = Array(96).fill(null);

                // Verwerk de data zodat deze op het juiste tijdstip geplaatst wordt
                data.forEach((item) => {
                    const date = item.tijd.split("T")[0]; // Datum uit de tijdstempel
                    const time = new Date(item.tijd).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                    const [hours, minutes] = time.split(':').map(Number);
                    const index = hours * 4 + Math.floor(minutes / 15); // Bereken de juiste index in stappen van 15 minuten

                    if (date === today) {
                        todayData[index] = item.binnentemperatuur; // Plaats de temperatuur op de juiste index
                    } else if (date === yesterday) {
                        yesterdayData[index] = item.binnentemperatuur; // Doe hetzelfde voor gisteren
                    }
                });

                // Setup chart data
                setChartData({
                    labels: generateTimeLabels(), // Tijdlabels van 00:00 tot 23:59
                    datasets: [
                        {
                            label: "Temperatuur Vandaag",
                            data: todayData ,
                            borderColor: "rgba(3, 11, 252)",
                            backgroundColor: "rgba(4, 191, 248)",
                            borderWidth: 2,
                        },
                        {
                            label: "Temperatuur Gisteren",
                            data: yesterdayData,
                            borderColor: "rgba(252, 3, 11)",
                            backgroundColor: "rgba(252, 3, 11, 0.5)",
                            borderWidth: 2,
                        },
                    ],
                });
            })
            .catch((error) => console.error('Error fetching data:', error));
    }, []); // Lege dependency-array zodat de functie alleen bij de eerste render wordt aangemaakt

    useEffect(() => {
        // Ophalen van de data bij het laden van de component
        fetchTemperatureData();

        // Interval instellen voor live-updates (bijvoorbeeld elke 5 minuten)
        const intervalId = setInterval(() => {
            fetchTemperatureData();
        }, 1000); // 300000 ms = 5 minuten

        // Opruimen van het interval bij ontkoppeling van de component
        return () => clearInterval(intervalId);
    }, [fetchTemperatureData]); // Voeg de functie als dependency toe

    // Als chartData nog null is, toon dan een laadbericht
    if (!chartData) {
        return <div>Loading...</div>;
    }

    return (
        <div>

            <Line data={chartData} />
        </div>
    );
};

export default TemperatureChartBinnen;

