import React, { useMemo } from 'react';
import useData from '../../hooks/useData';
import { formatCurrency } from '../../utils/formatters';
import Card from '../common/Card';
import Table from '../common/Table';
import { sortByKey } from '../../utils/dsa';

// Helper component to display the balance in a user-friendly way
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

export default function LedgerTable() {
  const { parties } = useData();
  
const sortedParties = useMemo(() => sortByKey(parties, 'name'), [parties]);

  const headers = ['Party Name', 'Type', 'Balance (Hisaab)'];

 return (
    <Card>
      <Table headers={headers}>
        {/* FIX: Map over sortedParties */}
        {sortedParties.map((party) => (
          <tr key={party.id}>
            <td className="whitespace-nowrap px-6 py-4 font-medium text-gray-900">{party.name}</td>
            <td className="whitespace-nowrap px-6 py-4 text-gray-500">{party.type}</td>
            <td className="whitespace-nowrap px-6 py-4">
              <PartyBalance balance={party.balance} />
            </td>
            {/* TODO: Add a "View Details" button to see the full ledger for this party */}
          </tr>
        ))}
      </Table>
    </Card>
  );
}