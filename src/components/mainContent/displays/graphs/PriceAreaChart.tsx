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
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 30,
              left: 0,
              bottom: 0,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey = {XAxisDataKey} />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey={areaDataKey} stroke="#8884d8" fill="#8884d8" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
  );
};

export default PriceAreaChart;