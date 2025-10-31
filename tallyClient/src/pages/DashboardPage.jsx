import React, { useState, useEffect, useMemo } from "react"; // useState aur useEffect import karein
import axios from "axios"; // axios import karein
import useData from "../hooks/useData"; // items, parties ko PDF ke liye lein
import useAuth from "../hooks/useAuth";
import DashboardCard from "../components/features/DashboardCard";
import { formatCurrency, formatDate } from "../utils/formatters";
import Card from "../components/common/Card";
import Button from "../components/common/Button";
import { generateInvoicePDF } from "../services/pdfService";
import { getSmartAlerts } from "../services/aiAssistant";
import Loader from "../components/common/Loader"; // Loader import karein

const alertStyles = {
  warning: "bg-orange-100 text-orange-800",
  info: "bg-blue-100 text-blue-800",
  success: "bg-green-100 text-green-800",
};

export default function DashboardPage() {

  const[user] = useState(useAuth().user);
  // items aur parties ko PDF generation ke liye yahaan se lein
  const { items, parties,transactions, loading: dataLoading } = useData();


  // --- Dashboard Calculations ---
  const stats = useMemo(() => {
    const stockValue = items.reduce((total, item) => {
      // --- FIX: Use currentStock ---
      return total + item.currentStock * item.purchaseRate;
    }, 0);

    const pendingDebtors = parties.reduce((total, party) => {
      if (party.type === "Debtor" && party.balance > 0) {
        return total + party.balance;
      }
      return total;
    }, 0);

    const today = new Date().toISOString().split("T")[0];
    const salesToday = transactions
      .filter((tx) => tx.type === "Sale" && tx.date.startsWith(today)) // Use startsWith for date/time safety
      .reduce((total, tx) => total + tx.grandTotal, 0);

    return { stockValue, pendingDebtors, salesToday };
  }, [items, parties, transactions]);

  const [loading, setLoading] = useState(true);

  // Backend se stats fetch karne ke liye useEffect
  useEffect(() => {
    const fetchDashboardStats = async () => {
      setLoading(true);
      try {
        // Backend API ko call karein (Vite proxy handle kar lega)
        // const { data } = await axios.get("/api/reports/dashboard");
        // setStats(data); // State mein data set karein
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []); // Yeh page load hote hi ek baar run hoga

  // --- Get recent transactions ---
  const recentTransactions = transactions.slice(0, 5);

  // --- Get AI Insights ---
  const aiAlerts = useMemo(
    () => getSmartAlerts(items, parties),
    [items, parties]
  );
  const handleDownloadInvoice = (tx) => {
    // Note: 'tx.party' ab ek object hai (populate ki wajah se)
    const party = parties.find((p) => p._id === tx.party._id);
    // --- END FIX ---

    if (party) {
      // Pass the full transaction, full party, master item list, and user
      // generateInvoicePDF(tx, party, items, user);
      console.log("Generating PDF for transaction:", tx);
      console.log("Party details:", party);
      generateInvoicePDF(tx, party, items, user);
    } else {
      alert("Error: Party details not found for this transaction.");
    }
  };

  // Jab tak data load ho raha hai, Loader dikhayein
  if (loading || dataLoading || !stats) {
    return <Loader />;
  }

return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">
        Welcome, {user?.shopName || 'Admin'}
      </h1>

      {/* --- Stat Cards --- */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        <DashboardCard
          title="Sales Today"
          value={formatCurrency(stats.salesToday)}
          icon="💰"
          note="Total sales for today"
        />
        <DashboardCard
          title="Total Stock Value"
          value={formatCurrency(stats.stockValue)}
          icon="📦"
          note={`${items.length} unique items`}
        />
        <DashboardCard
          title="Pending Debtors (Udaar)"
          value={formatCurrency(stats.pendingDebtors)}
          icon="🧾"
          note="Total amount to be collected"
        />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* --- AI Insights --- */}
        <Card>
          <h2 className="mb-4 text-xl font-semibold">Smart Alerts</h2>
          <ul className="space-y-2">
            {aiAlerts.map((alert, index) => (
              <li key={index} className="rounded-md bg-orange-100 p-3 text-sm text-orange-800">
                {alert.message}
              </li>
            ))}
          </ul>
        </Card>
        
        {/* --- Recent Transactions --- */}
        <Card>
          <h2 className="mb-4 text-xl font-semibold">Recent Transactions</h2>
          <ul className="space-y-3">
            {recentTransactions.map((tx) => (
              <li key={tx._id} className="flex items-center justify-between border-b pb-2">
                <div>
                  <p className="font-medium">{tx.type} (ID: ...{tx._id.slice(-6)})</p>
                  <p className="text-sm text-gray-600">
                    {/* tx.party is populated by backend with {name, type} */}
                    Party: {tx.party?.name} 
                  </p>
                  <p className="text-sm text-gray-500">{formatDate(tx.date)}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold">{formatCurrency(tx.grandTotal)}</p>
                  <Button
                    onClick={() => handleDownloadInvoice(tx)}
                    variant="secondary"
                    className="!w-auto !py-1 !px-2 !text-xs !mt-1"
                  >
                    Download PDF
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}