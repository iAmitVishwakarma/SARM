import React from 'react';
import useData from '../../hooks/useData';
import { formatCurrency } from '../../utils/formatters';
import Card from '../common/Card';
import Table from '../common/Table';

export default function StockTable() {
  const { items } = useData();

  const headers = ['Item Name', 'Current Stock', 'Purchase Rate', 'Sale Rate', 'Stock Value'];

  return (
    <Card>
      <Table headers={headers}>
        {items.map((item) => (
          <tr key={item.id}>
            <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">{item.name}</td>
            <td className="whitespace-nowrap px-6 py-4 text-gray-500">
              <span className={`font-bold ${item.stock < 10 ? 'text-red-600' : 'text-gray-700'}`}>
                {item.stock}
              </span>
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-gray-500">{formatCurrency(item.purchaseRate)}</td>
            <td className="whitespace-nowrap px-6 py-4 text-gray-500">{formatCurrency(item.saleRate)}</td>
            <td className="whitespace-nowrap px-6 py-4 font-semibold text-gray-700">
              {formatCurrency(item.stock * item.purchaseRate)}
            </td>
          </tr>
        ))}
      </Table>
    </Card>
  );
}