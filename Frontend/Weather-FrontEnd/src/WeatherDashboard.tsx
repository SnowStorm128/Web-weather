// WeatherDashboard.tsx
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

interface HourlyData {
  time: string; // ISO string
  temperature: number;
  humidity: number;
  cloud: number;
  pressure: number;
  wind: number;
  precip: number;
}

interface ThreeDayProb {
  date: string; // ISO string
  rainProb: number; // 0-100
}

interface WeatherDashboardProps {
  hourlyData: HourlyData[];
  targetDate: string; // ISO string
  predictedLabel: string;
  rainProbPercent: number;
  threeDayProbs: ThreeDayProb[];
}

const WeatherDashboard: React.FC<WeatherDashboardProps> = ({
  hourlyData,
  targetDate,
  predictedLabel,
  rainProbPercent,
  threeDayProbs,
}) => {
  return (
    <div className="p-6 space-y-8">
      <h2 className="text-lg font-semibold">
        Ngày hiển thị: {new Date(targetDate).toLocaleDateString()} – Dự đoán:{" "}
        {predictedLabel} – Xác suất mưa: {rainProbPercent.toFixed(1)}%
      </h2>

      {/* 2x3 line charts grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { key: "temperature", label: "Nhiệt độ", unit: "°C" },
          { key: "humidity", label: "Độ ẩm", unit: "%" },
          { key: "cloud", label: "Mây che phủ", unit: "%" },
          { key: "pressure", label: "Áp suất", unit: "hPa" },
          { key: "wind", label: "Tốc độ gió", unit: "m/s" },
          { key: "precip", label: "Lượng mưa", unit: "mm" },
        ].map((metric) => (
          <div key={metric.key} className="bg-white p-4 rounded shadow">
            <h3 className="font-medium mb-2">{metric.label}</h3>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={hourlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tickFormatter={(t) =>
                    new Date(t).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }
                  interval={2}
                />
                <YAxis
                  label={{ value: metric.unit, angle: -90, position: "insideLeft" }}
                />
                <Tooltip
                  labelFormatter={(t) =>
                    new Date(t).toLocaleTimeString("vi-VN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }
                  formatter={(value: number) => `${value} ${metric.unit}`}
                />
                <Line
                  type="monotone"
                  dataKey={metric.key as keyof HourlyData}
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ))}
      </div>

      {/* 3-day rain probability bar chart */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="font-medium mb-2">
          Xác suất mưa (%) – Hôm nay / Ngày mai / Ngày kia
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={threeDayProbs}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickFormatter={(d) =>
                new Date(d).toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" })
              }
            />
            <YAxis domain={[0, 100]} />
            <Tooltip
              formatter={(value: number) => `${value.toFixed(0)}%`}
              labelFormatter={(d) => new Date(d).toLocaleDateString("vi-VN")}
            />
            <Bar
              dataKey="rainProb"
              fill="#f87171"
              opacity={0.7}
            >
              {threeDayProbs.map((entry, idx) => (
                <text
                  key={`label-${idx}`}
                  x={idx}
                  y={entry.rainProb + 5}
                  textAnchor="middle"
                  fill="#000"
                  fontSize={12}
                >
                  {entry.rainProb.toFixed(0)}%
                </text>
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default WeatherDashboard;
