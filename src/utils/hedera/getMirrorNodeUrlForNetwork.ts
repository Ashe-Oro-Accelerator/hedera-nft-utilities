export const getMirrorNodeUrlForNetwork = (network: string): string => {
  return `https://${network === 'mainnet' ? 'mainnet-public' : network}.mirrornode.hedera.com/api/v1`;
};
