/*-
 *
 * Hedera NFT Utilities
 *
 * Copyright (C) 2023 Hedera Hashgraph, LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import { fromUnixTime } from 'date-fns';
import { dictionary } from '../utils/constants/dictionary';
import { getSingleNFTDetails, getTransactionsFromMirrorNode } from '../api/mirror-node';
import { NetworkName } from '@hashgraph/sdk/lib/client/Client';

export const getHolderAndDuration = async ({
  tokenId,
  serialNumber,
  network,
}: {
  tokenId: string;
  serialNumber: number;
  network: NetworkName;
}) => {
  const nftDetailsData = await getSingleNFTDetails(network, tokenId, serialNumber);

  if (nftDetailsData.deleted) {
    throw new Error(dictionary.errors.nftDeleted);
  }

  const transactionsData = await getTransactionsFromMirrorNode(network, tokenId, serialNumber);

  // We take the first 'CRYPTOTRANSFER' or 'TOKENMINT' transaction because these transactions represent the change of ownership of an NFT.
  // 'CRYPTOTRANSFER' indicates that the NFT was transferred from one account to another, while 'TOKENMINT' indicates that a new NFT was minted.
  // By taking the first of these transactions, we can determine the last owner of the NFT and the time when they became the owner
  const lastOwnerTransfer = transactionsData.find(
    (transaction) => transaction.type === 'CRYPTOTRANSFER' || transaction.type === 'TOKENMINT'
  );

  if (!lastOwnerTransfer) {
    throw new Error(dictionary.errors.nftNoTransactions);
  }

  const date = fromUnixTime(Number(lastOwnerTransfer.consensus_timestamp));
  const readableDate = date.toLocaleString();

  return {
    holder: lastOwnerTransfer.receiver_account_id,
    holderSince: readableDate,
  };
};
