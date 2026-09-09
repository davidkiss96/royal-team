interface FormattableAddress {
  addressLine1: string;
  city: string;
  postalCode: string;
}

/** "2451 Ercsi, Móricz Zsigmond utca 60." — an address in a single display line. */
export function formatAddress(address: FormattableAddress): string {
  return `${address.postalCode} ${address.city}, ${address.addressLine1}`;
}
