// A simple formatter for Indian Rupees
const currencyFormatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
});

export const formatCurrency = (amount) => {
  return currencyFormatter.format(amount);
};

// A simple date formatter
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};