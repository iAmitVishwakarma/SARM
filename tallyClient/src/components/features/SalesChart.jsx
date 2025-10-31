import React, { useState, useEffect } from 'react'; // useMemo aur useData hatayein
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Card from '../common/Card';
import axios from 'axios'; // axios import karein
import Loader from '../common/Loader'; // Loader import karein

// Register components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function SalesChart() {
  const [chartData, setChartData] = useState(null); // Data ke liye state banayein

  // Backend se chart data fetch karein
  useEffect(() => {
    const fetchChartData = async () => {
      try {
        // Naya API endpoint call karein
        const { data } = await axios.get('/api/reports/sales-chart');
        
        // Data ko Chart.js format mein set karein
        setChartData({
          labels: data.labels,
          datasets: [
            {
              label: 'Total Sales',
              data: data.data,
              backgroundColor: 'rgba(30, 58, 138, 0.6)',
              borderColor: 'rgba(30, 58, 138, 1)',
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error('Failed to fetch chart data', error);
      }
    };
    fetchChartData();
  }, []); // Page load par ek baar run hoga

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales by Day (Last 30 Days)',
      },
    },
  };

  // Jab tak data load ho raha hai
  if (!chartData) {
    return (
      <Card>
        <Loader />
      </Card>
    );
  }

  return (
    <Card>
      <Bar options={options} data={chartData} />
    </Card>
  );
}