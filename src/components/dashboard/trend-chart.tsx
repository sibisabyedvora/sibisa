'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface DayTrend {
  date: string;
  conversations: number;
  aiReplies: number;
}

export function TrendChart({ data }: { data: DayTrend[] }) {
  if (!data || data.length === 0) {
    return (
      <div className="flex h-64 w-full items-center justify-center text-xs text-muted-foreground border border-dashed rounded-xl">
        Belum ada data grafik percakapan 14 hari terakhir.
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorConvs" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorReplies" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
              <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
          <XAxis dataKey="date" tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} />
          <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 11, fill: '#64748B' }} allowDecimals={false} />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              borderRadius: '12px',
              border: '1px solid #E2E8F0',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
              fontSize: '12px',
            }}
          />
          <Area
            type="monotone"
            dataKey="conversations"
            name="Percakapan"
            stroke="#4F46E5"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorConvs)"
          />
          <Area
            type="monotone"
            dataKey="aiReplies"
            name="Balasan AI"
            stroke="#10B981"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#colorReplies)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
