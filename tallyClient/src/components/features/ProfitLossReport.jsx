import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../common/Card';
import DashboardCard from './DashboardCard';
import Loader from '../common/Loader';
import { formatCurrency } from '../../utils/formatters';

export default function ProfitLossReport() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPLData = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/reports/profit-loss');
        setStats(data);
      } catch (error) {
        console.error('Failed to fetch P&L data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPLData();
  }, []);

  if (loading) {
    return (
      <Card>
        <Loader />
      </Card>
    );
  }

  if (!stats) {
    return <Card>Could not load Profit & Loss data.</Card>;
  }

  return (
    <Card>
      <h2 className="mb-4 text-2xl font-bold">Profit & Loss (Overall)</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <DashboardCard
          title="Net Sales"
          value={formatCurrency(stats.netSales)}
          icon="📈"
          note="(Total Sales - Sales Returns)"
        />
        <DashboardCard
          title="Net Purchases"
          value={formatCurrency(stats.netPurchases)}
          icon="🛒"
          note="(Total Purchases - Purchase Returns)"
        />
        <DashboardCard
          title="Total Expenses"
          value={formatCurrency(stats.totalExpenses)}
          icon="💸"
          note="(All 'Payment' entries)"
        />
        <DashboardCard
          title="Net Profit"
          value={formatCurrency(stats.netProfit)}
          icon="🏆"
          note="(Net Sales - Net Purchases - Expenses)"
        />
      </div>
    </Card>
  );
}