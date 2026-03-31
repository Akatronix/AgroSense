import React, { useMemo, useState } from "react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import {
  Sprout,
  Droplets,
  Thermometer,
  FlaskConical,
  Activity,
  Wind,
  Sun,
} from "lucide-react";
import { useUserDataStore } from "@/stores/userDataStore";
import { toast } from "sonner";
import api from "@/services/api";

// Mock Data for Agriculture
const SOIL_DATA = [
  {
    time: "00:00",
    nitrogen: 45,
    phosphorus: 12,
    potassium: 8,
    moisture: 65,
    ph: 6.8,
    temp: 24,
  },
  {
    time: "04:00",
    nitrogen: 46,
    phosphorus: 12,
    potassium: 8,
    moisture: 63,
    ph: 6.9,
    temp: 23,
  },
  {
    time: "08:00",
    nitrogen: 45,
    phosphorus: 13,
    potassium: 9,
    moisture: 60,
    ph: 7.0,
    temp: 26,
  },
  {
    time: "12:00",
    nitrogen: 44,
    phosphorus: 12,
    potassium: 9,
    moisture: 55,
    ph: 7.1,
    temp: 30,
  },
  {
    time: "16:00",
    nitrogen: 43,
    phosphorus: 11,
    potassium: 8,
    moisture: 58,
    ph: 6.9,
    temp: 28,
  },
  {
    time: "20:00",
    nitrogen: 45,
    phosphorus: 12,
    potassium: 8,
    moisture: 62,
    ph: 6.8,
    temp: 25,
  },
];

const cn = (...classes) => classes.filter(Boolean).join(" ");

const Card = ({ children, className }) => (
  <div
    className={cn(
      "bg-white border border-gray-200 rounded-xl shadow-sm",
      className,
    )}
  >
    {children}
  </div>
);

const MetricCard = ({ title, value, subtitle, icon: Icon, color, trend }) => (
  <Card className="p-5 flex items-center gap-4 hover:shadow-md transition-shadow">
    <div className={cn("p-3 rounded-lg", color)}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <div className="flex-1">
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900">{value}</h3>
      <div className="flex items-center gap-2 mt-0.5">
        <p className="text-xs text-gray-400">{subtitle}</p>
        {trend && (
          <span
            className={cn(
              "text-xs font-medium",
              trend > 0 ? "text-green-600" : "text-red-500",
            )}
          >
            {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}%
          </span>
        )}
      </div>
    </div>
  </Card>
);

const PHIndicator = ({ value }) => {
  const getColor = (ph) => {
    if (ph < 6) return "bg-red-500";
    if (ph < 6.5) return "bg-orange-500";
    if (ph < 7.5) return "bg-green-500";
    if (ph < 8) return "bg-blue-500";
    return "bg-purple-500";
  };

  const getStatus = (ph) => {
    if (ph < 6) return "Acidic";
    if (ph < 6.5) return "Slightly Acidic";
    if (ph < 7.5) return "Optimal";
    if (ph < 8) return "Slightly Alkaline";
    return "Alkaline";
  };

  return (
    <div className="flex items-center gap-3">
      <div className={cn("w-3 h-3 rounded-full", getColor(value))} />
      <span className="text-sm font-medium text-gray-700">
        {getStatus(value)}
      </span>
    </div>
  );
};

const DashboardContent = () => {
  const { hardwareData, chartData } = useUserDataStore();

  const safeHardwareData = hardwareData || {
    systemStatus: false,
    irrigation: false,
    nitrogen: 0,
    phosphorus: 0,
    potassium: 0,
    moisture: 0,
    ph: 7.0,
    temperature: 0,
  };

  const transformedChartData = useMemo(() => {
    if (!chartData || chartData.length === 0) {
      return SOIL_DATA;
    }

    return chartData.map((item) => {
      const date = new Date(item.timestamp);
      const time = `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

      return {
        time,
        nitrogen: item.nitrogen || 0,
        phosphorus: item.phosphorus || 0,
        potassium: item.potassium || 0,
        moisture: item.moisture || 0,
        ph: item.ph || 7.0,
        temp: item.temperature || 0,
      };
    });
  }, [chartData]);

  const soilHealthScore = useMemo(() => {
    const { nitrogen, phosphorus, potassium, moisture, ph } = safeHardwareData;
    let score = 0;
    if (nitrogen >= 40 && nitrogen <= 60) score += 20;
    else score += 10;
    if (phosphorus >= 10 && phosphorus <= 20) score += 20;
    else score += 10;
    if (potassium >= 8 && potassium <= 15) score += 20;
    else score += 10;
    if (moisture >= 60 && moisture <= 80) score += 20;
    else score += 10;
    if (ph >= 6.5 && ph <= 7.5) score += 20;
    else score += 10;
    return score;
  }, [safeHardwareData]);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Soil Monitor</h1>
          <p className="text-gray-500 text-sm mt-1">
            Real-time NPK, pH, temperature, and moisture monitoring
          </p>
        </div>
        <div className="bg-[#17cf97]/10 px-4 py-2 rounded-full flex items-center gap-2">
          <Sprout className="w-5 h-5 text-[#17cf97]" />
          <span className="text-[#17cf97] font-semibold">
            Soil Health: {soilHealthScore}%
          </span>
        </div>
      </div>

      {/* NPK Section */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <FlaskConical className="w-5 h-5 text-[#17cf97]" />
          Nutrient Levels (NPK)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Nitrogen (N)"
            value={
              safeHardwareData.nitrogen
                ? `${safeHardwareData.nitrogen} mg/kg`
                : "0 mg/kg"
            }
            subtitle="Optimal: 40-60"
            icon={Wind}
            color="bg-green-500"
            trend={2.5}
          />
          <MetricCard
            title="Phosphorus (P)"
            value={
              safeHardwareData.phosphorus
                ? `${safeHardwareData.phosphorus} mg/kg`
                : "0 mg/kg"
            }
            subtitle="Optimal: 10-20"
            icon={Sun}
            color="bg-yellow-500"
            trend={-1.2}
          />
          <MetricCard
            title="Potassium (K)"
            value={
              safeHardwareData.potassium
                ? `${safeHardwareData.potassium} mg/kg`
                : "0 mg/kg"
            }
            subtitle="Optimal: 8-15"
            icon={Activity}
            color="bg-orange-500"
            trend={0.8}
          />
        </div>
      </div>

      {/* Environmental Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Thermometer className="w-5 h-5 text-[#17cf97]" />
          Environmental Conditions
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <MetricCard
            title="Soil Moisture"
            value={
              safeHardwareData.moisture ? `${safeHardwareData.moisture}%` : "0%"
            }
            subtitle="Optimal: 60-80%"
            icon={Droplets}
            color="bg-blue-500"
          />
          <MetricCard
            title="Temperature"
            value={
              safeHardwareData.temperature
                ? `${safeHardwareData.temperature}°C`
                : "0°C"
            }
            subtitle="Optimal: 20-30°C"
            icon={Thermometer}
            color="bg-red-500"
          />
          <MetricCard
            title="pH Level"
            value={safeHardwareData.ph ? safeHardwareData.ph : "7.0"}
            subtitle="Optimal: 6.5-7.5"
            icon={FlaskConical}
            color="bg-purple-500"
          />
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* NPK Trends */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">NPK Trends</h3>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-gray-500">
                <span className="w-2 h-2 rounded-full bg-green-500" /> Nitrogen
              </span>
              <span className="flex items-center gap-1.5 text-gray-500">
                <span className="w-2 h-2 rounded-full bg-yellow-500" />{" "}
                Phosphorus
              </span>
              <span className="flex items-center gap-1.5 text-gray-500">
                <span className="w-2 h-2 rounded-full bg-orange-500" />{" "}
                Potassium
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={transformedChartData}>
                <defs>
                  <linearGradient id="colorN" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22c55e" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorP" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#eab308" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#eab308" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorK" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="time"
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="nitrogen"
                  stroke="#22c55e"
                  strokeWidth={2}
                  fill="url(#colorN)"
                />
                <Area
                  type="monotone"
                  dataKey="phosphorus"
                  stroke="#eab308"
                  strokeWidth={2}
                  fill="url(#colorP)"
                />
                <Area
                  type="monotone"
                  dataKey="potassium"
                  stroke="#f97316"
                  strokeWidth={2}
                  fill="url(#colorK)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Moisture & Temperature */}
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900">
              Moisture & Temperature
            </h3>
            <div className="flex gap-3 text-xs">
              <span className="flex items-center gap-1.5 text-gray-500">
                <span className="w-2 h-2 rounded-full bg-blue-500" /> Moisture
              </span>
              <span className="flex items-center gap-1.5 text-gray-500">
                <span className="w-2 h-2 rounded-full bg-red-500" /> Temperature
              </span>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={transformedChartData}>
                <defs>
                  <linearGradient
                    id="colorMoisture"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#ef4444" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                <XAxis
                  dataKey="time"
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#fff",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="moisture"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  fill="url(#colorMoisture)"
                />
                <Area
                  type="monotone"
                  dataKey="temp"
                  stroke="#ef4444"
                  strokeWidth={2}
                  fill="url(#colorTemp)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* pH History Bar Chart */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">pH Level History</h3>
          <span className="text-xs text-gray-500">
            Optimal range: 6.5 - 7.5
          </span>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={transformedChartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis
                dataKey="time"
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#9ca3af"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                domain={[0, 14]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="ph" radius={[4, 4, 0, 0]}>
                {transformedChartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.ph >= 6.5 && entry.ph <= 7.5 ? "#17cf97" : "#ef4444"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>
    </div>
  );
};

export default DashboardContent;
