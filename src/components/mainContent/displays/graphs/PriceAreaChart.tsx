import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


export type PriceAreaChartProps = {
  chartData: { [key: string]: string | number }[]
  XAxisDataKey: string
  areaDataKey: string 
}

const PriceAreaChart = ({chartData, XAxisDataKey, areaDataKey}: PriceAreaChartProps) => {
  return (
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="priceFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#9147ff" stopOpacity={0.26} />
                <stop offset="100%" stopColor="#9147ff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="#28282e" vertical={false} />
            <XAxis dataKey = {XAxisDataKey} tick={{ fill: '#8f8f9a', fontSize: 11 }} axisLine={{ stroke: '#3a3a42' }} tickLine={false} />
            <YAxis tick={{ fill: '#8f8f9a', fontSize: 11 }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ background: '#26262c', border: '1px solid #3d3d46', borderRadius: 6 }}
              labelStyle={{ color: '#8f8f9a', fontSize: 11 }}
              itemStyle={{ color: '#efeff1', fontWeight: 700 }}
              cursor={{ stroke: '#55555f' }}
            />
            <Area type="monotone" dataKey={areaDataKey} stroke="#9147ff" strokeWidth={2} fill="url(#priceFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
  );
};

export default PriceAreaChart;