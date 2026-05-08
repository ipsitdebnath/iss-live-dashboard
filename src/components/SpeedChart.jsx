/**
 * SpeedChart Component
 * Red/orange line chart matching reference "ISS Speed Trend"
 */
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts';

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg p-2.5 border border-[var(--border-color)] bg-[var(--bg-card)] shadow-md">
      <p className="text-[11px] text-[var(--text-muted)] mb-0.5">{label}</p>
      <p className="text-sm font-bold text-[var(--accent)]">
        {payload[0].value?.toLocaleString()} km/h
      </p>
    </div>
  );
}

export default function SpeedChart({ speedHistory }) {
  // If we have only 1 point, duplicate it so the line chart can render immediately
  const displayData = speedHistory?.length === 1 
    ? [speedHistory[0], { ...speedHistory[0], time: 'Initializing...' }]
    : speedHistory;

  if (!displayData || displayData.length === 0) {
    return (
      <div className="rounded-lg p-5 border border-[var(--border-color)] bg-[var(--bg-card)] h-full flex flex-col">
        <h3 className="text-base font-bold text-[var(--text-primary)] mb-4">ISS Speed Trend</h3>
        <div className="flex-1 flex items-center justify-center text-sm text-[var(--text-muted)]">
          Collecting speed data... (0/1 measurements)
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg p-5 border border-[var(--border-color)] bg-[var(--bg-card)] h-full flex flex-col">
      <h3 className="text-base font-bold text-[var(--text-primary)] mb-4">ISS Speed Trend</h3>
      <div className="flex-1 w-full min-h-[250px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={displayData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis
              dataKey="time"
              tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
              axisLine={{ stroke: 'var(--chart-grid)' }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              domain={['dataMin - 5', 'dataMax + 5']}
              tick={{ fill: 'var(--text-muted)', fontSize: 10 }}
              axisLine={{ stroke: 'var(--chart-grid)' }}
              tickFormatter={(v) => `${v.toFixed(0)}`}
              width={45}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '12px', paddingTop: '8px' }}
            />
            <Line
              type="monotone"
              dataKey="speed"
              name="ISS Speed (km/h)"
              stroke="var(--chart-line)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, fill: 'var(--chart-line)', stroke: '#fff', strokeWidth: 2 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
