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
        "https://localhost:44373/api/BuitenTemperatuur"
      );
      const data = await response.json();

      const temperaturen = data.map((entry) => entry.temperatuur);
      const tijden = data.map((entry) =>
        new Date(entry.tijd).toLocaleTimeString()
      );

      setChartData({
        labels: tijden,
        datasets: [
          {
            label: "Temperatuur in Akkrum",
            data: temperaturen,
            borderColor: "rgba(3, 11, 252)",
            backgroundColor: "rgba(235, 252, 3)",
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
    <div className="chart-container">
      {chartData ? (
        <Line
          data={chartData}
          options={{
            maintainAspectRatio: false, // Hiermee kun je de verhouding aanpassen
            scales: {
              y: {
                beginAtZero: false,
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
