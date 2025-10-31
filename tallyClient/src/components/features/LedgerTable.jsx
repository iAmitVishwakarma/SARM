import React, { useMemo } from 'react';
import useData from '../../hooks/useData';
import { formatCurrency } from '../../utils/formatters';
import Card from '../common/Card';
import Table from '../common/Table';
import Button from '../common/Button'; // --- Import Button ---
import { sortByKey } from '../../utils/dsa';

const PartyBalance = ({ balance }) => {
  const formattedBalance = formatCurrency(Math.abs(balance));
  if (balance > 0) {
    return (
      <span className="font-semibold text-green-600">
        {formattedBalance} (Lene Hain)
      </span>
    );
  }
  if (balance < 0) {
    return (
      <span className="font-semibold text-red-600">
        {formattedBalance} (Dene Hain)
      </span>
    );
  }
  return <span className="text-gray-500">Settled</span>;
};

// --- Receive onEditParty prop ---
export default function LedgerTable({ onEditParty }) {
  const { parties } = useData();

  const sortedParties = useMemo(() => sortByKey(parties, 'name'), [parties]);

  // --- Add 'Actions' header ---
  const headers = ['Party Name', 'Type', 'Balance (Hisaab)', 'Actions'];

  return (
    <Card>
      <Table headers={headers}>
        {sortedParties.map((party) => (
          <tr key={party._id}>
            <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">
              {party.name}
            </td>
            <td className="whitespace-nowrap px-6 py-4 text-gray-500">
              {party.type}
            </td>
            <td className="whitespace-nowrap px-6 py-4">
              <PartyBalance balance={party.balance} />
            </td>
            {/* --- Add Edit Button --- */}
            <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
              <Button
                onClick={() => onEditParty(party)}
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