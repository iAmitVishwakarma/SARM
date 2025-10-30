import React, { useMemo } from 'react';
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
import useData from '../../hooks/useData';
import Card from '../common/Card';
import { TRANSACTION_TYPES } from '../../utils/constants';

// 1. Register the components Chart.js needs
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function SalesChart() {
  const { transactions } = useData();

  // 2. Process the transaction data
  const chartData = useMemo(() => {
    // We'll process data into a simple format: { 'YYYY-MM-DD': totalSales }
    const salesByDate = transactions
      .filter(tx => tx.type === TRANSACTION_TYPES.SALE) // Only get sales
      .reduce((acc, tx) => {
        const date = tx.date; // Use the date from the transaction
        if (!acc[date]) {
          acc[date] = 0;
        }
        acc[date] += tx.grandTotal;
        return acc;
      }, {});

    // Sort by date to make the chart chronological
    const sortedDates = Object.keys(salesByDate).sort();
    
    // 3. Format for Chart.js
    const labels = sortedDates.map(date => 
      new Date(date).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
    );
    const data = sortedDates.map(date => salesByDate[date]);

    return {
      labels,
      datasets: [
        {
          label: 'Total Sales',
          data: data,
          backgroundColor: 'rgba(30, 58, 138, 0.6)', // 'brand-blue' with 60% opacity
          borderColor: 'rgba(30, 58, 138, 1)',
          borderWidth: 1,
        },
      ],
    };
  }, [transactions]); // Re-calculate only when transactions change

  // 4. Configure chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Sales by Day',
      },
    },
  };

  return (
    <Card>
      <Bar options={options} data={chartData} />
    </Card>
  );
}