import { useEffect, useState } from "react"
import WeatherDashboard from "./WeatherDashboard.tsx"

export default function App() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("http://localhost:3000/api/weather")
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setData(data)
      })
      .catch(console.error);
  }, []);
  if (!data) return <div>Loading...</div>
  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <WeatherDashboard
        hourlyData={data.hourlyData}
        targetDate={data.targetDate}
        predictedLabel={data.predicted_label}
        rainProbPercent={data.rain_prob_percent}
        threeDayProbs={data.three_day_probs}
      />
    </div>
  );
}

