import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const TemperatureChart = () => {
  const [chartData, setChartData] = useState(null);

  const fetchTemperatureData = async () => {
    try {
      const response = await fetch(
        "http://192.168.0.76:5000/api/BuitenTemperatuur"
      );
      const data = await response.json();

      console.log("Fetched data:", data);

      // Helper function to format time to HH:MM (removing seconds and milliseconds)
      const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });
      };

      // Helper function to subtract 2 hours from a date
      const subtractTwoHours = (utcTime) => {
        const date = new Date(utcTime);
        date.setHours(date.getHours() - 2);
        return date;
      };

      // Create time labels from 00:00 to 23:59 in steps of 15 minutes
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

      const timeLabels = generateTimeLabels();

      console.log("Generated time labels:", timeLabels);

      // Get today's date
      const today = new Date();
      const todayDay = today.getDate();
      const todayMonth = today.getMonth();
      const todayYear = today.getFullYear();

      const isYesterday = (date) => {
        const entryDate = subtractTwoHours(date); // Subtract 2 hours before comparison
        return (
          entryDate.getFullYear() === todayYear &&
          entryDate.getMonth() === todayMonth &&
          entryDate.getDate() === todayDay - 1
        );
      };

      // Filter data for today and yesterday
      const todayData = data.filter((entry) => {
        const entryDate = subtractTwoHours(entry.tijd); // Subtract 2 hours for comparison
        return (
          entryDate.getFullYear() === todayYear &&
          entryDate.getMonth() === todayMonth &&
          entryDate.getDate() === todayDay
        );
      });

      const yesterdayData = data.filter((entry) => isYesterday(entry.tijd));

      console.log("Today data:", todayData);
      console.log("Yesterday data:", yesterdayData);

      // Flexible matching: map data to nearest time label
      const mapDataToTime = (dataArray) => {
        const temperatures = new Array(timeLabels.length).fill(null); // Fill with null initially
        dataArray.forEach((entry) => {
          const entryTime = formatTime(subtractTwoHours(entry.tijd)); // Subtract 2 hours for display
          let closestIndex = -1;
          let closestDiff = Infinity;

          // Find the closest label to the entry time
          timeLabels.forEach((label, index) => {
            const labelTime = new Date(`1970-01-01T${label}:00Z`).getTime();
            const entryTimeObj = new Date(
              `1970-01-01T${entryTime}:00Z`
            ).getTime();
            const diff = Math.abs(labelTime - entryTimeObj);

            if (diff < closestDiff) {
              closestDiff = diff;
              closestIndex = index;
            }
          });

          // Assign the temperature to the closest matching time label
          if (closestIndex !== -1) {
            temperatures[closestIndex] = entry.temperatuur;
          }
        });
        return temperatures;
      };

      const todayTemperatures = mapDataToTime(todayData);
      const yesterdayTemperatures = mapDataToTime(yesterdayData);

      console.log("Today temperatures:", todayTemperatures);
      console.log("Yesterday temperatures:", yesterdayTemperatures);

      setChartData({
        labels: timeLabels,
        datasets: [
          {
            label: "Temperatuur Vandaag",
            data: todayTemperatures,
            borderColor: "rgba(3, 11, 252)",
            backgroundColor: "rgba(4, 191, 248)",
            borderWidth: 2,
          },
          {
            label: "Temperatuur Gisteren",
            data: yesterdayTemperatures,
            borderColor: "rgba(252, 3, 11)",
            backgroundColor: "rgba(252, 3, 11, 0.5)",
            borderWidth: 2,
          },
        ],
      });
    } catch (error) {
      console.error("Fout bij het ophalen van de data:", error);
    }
  };

  useEffect(() => {
    fetchTemperatureData();
    const chartIntervalid = setInterval(fetchTemperatureData, 30000);
    return () => {
      clearInterval(chartIntervalid);
    };
  }, []);

  return (
    <div className="chart-container" style={{ height: "400px" }}>
      {chartData ? (
        <Line
          data={chartData}
          options={{
            maintainAspectRatio: false,
            scales: {
              y: {
                beginAtZero: false,
              },
              x: {
                ticks: {
                  maxRotation: 90,
                  minRotation: 45,
                },
              },
            },
          }}
        />
      ) : (
        <p>Bezig met het laden van de data...</p>
      )}
    </div>
  );
};

export default TemperatureChart;
