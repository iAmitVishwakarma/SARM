import React from 'react';
import useData from '../../hooks/useData';
import { formatCurrency } from '../../utils/formatters';
import Card from '../common/Card';
import Table from '../common/Table';
import Button from '../common/Button'; // --- Import Button ---

// --- Receive onEditItem prop ---
export default function StockTable({ onEditItem }) {
  const { items } = useData();

  // --- Add 'Actions' header ---
  const headers = [
    'Item Name',
    'Current Stock',
    'Purchase Rate',
    'Sale Rate',
    'Stock Value',
    'Actions',
  ];

  return (
    <Card>
      <Table headers={headers}>
        {items.map((item) => (
          <tr key={item._id}>
            <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
              {item.name}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-gray-500">
              <span
                className={`font-bold ${
                  item.currentStock < 10 ? 'text-red-600' : 'text-gray-700'
                }`}
              >
                {item.currentStock} {item.unit}
              </span>
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-gray-500">
              {formatCurrency(item.purchaseRate)}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-gray-500">
              {formatCurrency(item.saleRate)}
            </td>
            <td className="whitespace-nowrap px-6 py-4 font-semibold text-gray-700">
              {formatCurrency(item.currentStock * item.purchaseRate)}
            </td>
            {/* --- Add Edit Button --- */}
            <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
              <Button
                onClick={() => onEditItem(item)}
                variant="secondary"
                className="!w-auto !py-1 !px-3"
              >
                Edit
              </Button>
            </td>
          </tr>
        ))}
      </Table>
    </Card>
  );
}