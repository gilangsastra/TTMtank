const idrFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat("id-ID");

export function formatRupiah(value: number): string {
  return idrFormatter.format(value);
}

export function formatLiter(value: number): string {
  return `${numberFormatter.format(value)} Liter`;
}
