import * as React from "react";
import { LineChart } from "@mui/x-charts/LineChart";

const BasicLineChart: React.FC<any> = ({ data }) => {
    return <LineChart xAxis={[{ data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12] }]} series={data} width={500} height={300} />;
};

export default BasicLineChart;
