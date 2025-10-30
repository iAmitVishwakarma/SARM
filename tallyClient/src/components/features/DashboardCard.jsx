import React from 'react';
import Card from '../common/Card';

export default function DashboardCard({ title, value, icon, note }) {
  return (
    <Card>
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-500">{title}</span>
        <span className="text-2xl text-brand-blue">{icon}</span>
      </div>
      <div className="mt-2">
        <p className="text-3xl font-bold text-brand-charcoal">{value}</p>
        {note && <p className="mt-1 text-xs text-gray-500">{note}</p>}
      </div>
    </Card>
  );
}