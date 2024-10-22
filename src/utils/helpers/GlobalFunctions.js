export const formatePrice = amount => {
  return Number(amount)
    .toFixed(2)
    .replace(/\d(?=(\d{3})+\.)/g, '$&,');
};
