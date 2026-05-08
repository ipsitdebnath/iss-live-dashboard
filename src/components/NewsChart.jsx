/**
 * NewsChart Component
 * Doughnut/pie chart showing article distribution by news source
 */
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const COLORS = ['#c75b12', '#2563eb', '#059669', '#d97706', '#7c3aed', '#dc2626', '#0891b2', '#be185d'];

function CustomTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg p-2.5 border border-[var(--border-color)] bg-[var(--bg-card)] shadow-md">
      <p className="text-sm font-semibold text-[var(--text-primary)]">{payload[0].name}</p>
      <p className="text-xs text-[var(--text-muted)]">{payload[0].value} article{payload[0].value > 1 ? 's' : ''}</p>
    </div>
  );
}

export default function NewsChart({ sourceDistribution, onSourceClick }) {
  if (!sourceDistribution || sourceDistribution.length === 0) return null;

  return (
    <div className="rounded-lg p-5 border border-[var(--border-color)] bg-[var(--bg-card)]">
      <h3 className="text-base font-bold text-[var(--text-primary)] mb-4">News Sources</h3>
      <div className="w-full h-56">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={sourceDistribution}
              cx="50%"
              cy="45%"
              innerRadius={40}
              outerRadius={70}
              paddingAngle={2}
              dataKey="value"
              nameKey="name"
              onClick={(data) => onSourceClick?.(data.name)}
              style={{ cursor: 'pointer' }}
            >
              {sourceDistribution.map((_, index) => (
                <Cell
                  key={index}
                  fill={COLORS[index % COLORS.length]}
                  stroke="var(--bg-card)"
                  strokeWidth={2}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              wrapperStyle={{ fontSize: '11px' }}
              formatter={(value) => <span style={{ color: 'var(--text-secondary)' }}>{value}</span>}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
