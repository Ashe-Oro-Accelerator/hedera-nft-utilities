import { Network } from '../types/mint-token.module';
import { getMirrorNodeUrlForNetwork } from '../utils/hedera/get-mirror-node-url-for-network';
import axios from 'axios';
import { NFTDetails, NFTTransactionsRequest } from '../types/nfts.module';
import { fromUnixTime } from 'date-fns';

export const getHolderAndDuration = async ({
  tokenId,
  serialNumber,
  network,
}: {
  tokenId: string;
  serialNumber: number;
  network: Network;
}) => {
  const detailsUrl = `${getMirrorNodeUrlForNetwork(network)}/tokens/${tokenId}/nfts/${serialNumber}`;
  const transactionsUrl = `${getMirrorNodeUrlForNetwork(network)}/tokens/${tokenId}/nfts/${serialNumber}/transactions`;

  const { data: nftDetails } = await axios.get<NFTDetails>(detailsUrl);

  if (nftDetails.deleted) {
    throw new Error('NFT has been deleted');
  }

  const {
    data: { transactions },
  } = await axios.get<NFTTransactionsRequest>(transactionsUrl);

  const firstCryptoTransfer = transactions.find((transaction) => transaction.type === 'CRYPTOTRANSFER');

  if (!firstCryptoTransfer) {
    throw new Error('NFT has not been transferred');
  }

  const date = fromUnixTime(Number(firstCryptoTransfer.consensus_timestamp));
  const readableDate = date.toLocaleString();

  return {
    holder: firstCryptoTransfer.receiver_account_id,
    holderSince: readableDate,
  };
};
