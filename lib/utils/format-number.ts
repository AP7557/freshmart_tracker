export const formatMoney = (value: string | number) =>
  Number(value)
    .toFixed(2)
    .replace(/\B(?=(\d{3})+(?!\d))/g, ',');
