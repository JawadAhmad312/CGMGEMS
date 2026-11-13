const DEFAULT_PKR_PER_USD = 280;

export const PKR_PER_USD = Number(import.meta.env.VITE_PKR_PER_USD) || DEFAULT_PKR_PER_USD;

export const pkrToUsd = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? amount / PKR_PER_USD : 0;
};

export const usdToPkr = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) ? Math.round(amount * PKR_PER_USD) : 0;
};

export const formatUsd = (value) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(pkrToUsd(value));

export const formatPkr = (value) =>
  `${new Intl.NumberFormat("en-PK").format(Number(value) || 0)} PKR`;

export const formatUsdInput = (value) => {
  const amount = Number(value);
  return Number.isFinite(amount) && amount > 0
    ? pkrToUsd(amount).toFixed(2)
    : "";
};
