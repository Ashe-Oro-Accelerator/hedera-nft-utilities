/*-
 *
 * Hedera NFT Utilities
 *
 * Copyright (C) 2024 Hedera Hashgraph, LLC
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
import { Client, CustomFixedFee, CustomRoyaltyFee, NftId, PrivateKey } from '@hashgraph/sdk';
import { NetworkName } from '@hashgraph/sdk/lib/client/Client';
import { CreateCollectionKeysType } from '../types/create-collection.module';
import { JsonMetadataFromCSVInterface } from '../types/json-metadata-from-csv.module';
import { increaseNFTSupply } from './increase-nft-supply';
import { createCollectionFunction } from './create-collection';
import { logIn } from './log-in';
import { createJsonMetadataFromCSV } from './create-json-metadata-from-csv';
import { mintUniqueMetadataFunction } from './mint-unique-metadata-function';
import { mintSharedMetadataFunction } from './mint-shared-metadata-function';
import { estimateCreateCollectionInDollars } from './estimate-create-collection-in-dollars';
import { estimateCreateCollectionInHbar } from './estimate-create-collection-in-hbar';

export class HederaNFTSDK {
  accountId: string;
  privateKey: string;
  client: Client;
  network: NetworkName;

  constructor(accountId: string, privateKey: string, network: NetworkName) {
    this.accountId = accountId;
    this.privateKey = privateKey;
    this.client = logIn({ myAccountId: accountId, myPrivateKey: privateKey, network: network });
    this.network = network;
  }

  createCollection({
    collectionName,
    collectionSymbol,
    treasuryAccountPrivateKey,
    treasuryAccount,
    keys,
    maxSupply,
    customFees,
  }: {
    collectionName: string;
    collectionSymbol: string;
    treasuryAccountPrivateKey?: string;
    treasuryAccount?: string;
    keys?: CreateCollectionKeysType;
    maxSupply?: number;
    customFees?: CustomFixedFee[] | CustomRoyaltyFee[];
  }) {
    return createCollectionFunction({
      client: this.client,
      collectionName,
      collectionSymbol,
      keys,
      myPrivateKey: this.privateKey,
      treasuryAccount,
      treasuryAccountPrivateKey,
      maxSupply,
      customFees,
    });
  }

  estimateCreateCollectionInDollars({
    collectionName,
    collectionSymbol,
    treasuryAccountPrivateKey,
    treasuryAccount,
    keys,
    customFees,
  }: {
    collectionName: string;
    collectionSymbol: string;
    treasuryAccountPrivateKey?: string;
    treasuryAccount?: string;
    keys?: CreateCollectionKeysType;
    customFees?: CustomFixedFee[] | CustomRoyaltyFee[];
  }) {
    return estimateCreateCollectionInDollars({
      collectionName,
      collectionSymbol,
      keys,
      treasuryAccount,
      treasuryAccountPrivateKey,
      customFees,
    });
  }

  estimateCreateCollectionInHbar({
    collectionName,
    collectionSymbol,
    treasuryAccountPrivateKey,
    treasuryAccount,
    keys,
    customFees,
    mirrorNodeUrl,
  }: {
    collectionName: string;
    collectionSymbol: string;
    treasuryAccountPrivateKey?: string;
    treasuryAccount?: string;
    keys?: CreateCollectionKeysType;
    customFees?: CustomFixedFee[] | CustomRoyaltyFee[];
    mirrorNodeUrl?: string;
  }) {
    return estimateCreateCollectionInHbar({
      collectionName,
      collectionSymbol,
      keys,
      treasuryAccount,
      treasuryAccountPrivateKey,
      customFees,
      network: this.network,
      mirrorNodeUrl,
    });
  }

  createJsonMetadataFromCSV({
    savedJsonFilesLocation,
    csvFilePath,
    nftsLimit,
  }: {
    savedJsonFilesLocation: string;
    csvFilePath: string;
    nftsLimit?: number;
  }): Promise<JsonMetadataFromCSVInterface> {
    return createJsonMetadataFromCSV({
      savedJsonFilesLocation,
      csvFilePath,
      nftsLimit,
    });
  }

  mintSharedMetadata({
    tokenId,
    amount,
    batchSize = 5,
    metaData,
    supplyKey,
  }: {
    tokenId: string;
    amount: number;
    batchSize?: number;
    metaData: string;
    supplyKey?: PrivateKey;
  }) {
    return mintSharedMetadataFunction({
      client: this.client,
      tokenId,
      amount,
      batchSize,
      metaData,
      supplyKey: supplyKey || PrivateKey.fromString(this.privateKey),
    });
  }

  mintUniqueMetadata({
    tokenId,
    batchSize = 5,
    supplyKey,
    pathToMetadataURIsFile,
    metadata,
  }: {
    tokenId: string;
    batchSize?: number;
    supplyKey: PrivateKey;
    pathToMetadataURIsFile?: string;
    metadata?: string[];
  }) {
    return mintUniqueMetadataFunction({
      client: this.client,
      tokenId,
      batchSize,
      supplyKey,
      pathToMetadataURIsFile,
      metadataArray: metadata,
    });
  }

  increaseNFTSupply({
    nftId,
    amount,
    batchSize = 5,
    supplyKey,
    mirrorNodeUrl,
  }: {
    nftId: NftId;
    amount: number;
    batchSize?: number;
    supplyKey?: PrivateKey;
    mirrorNodeUrl?: string;
  }) {
    return increaseNFTSupply({
      client: this.client,
      network: this.network,
      nftId,
      amount,
      batchSize,
      supplyKey: supplyKey || PrivateKey.fromString(this.privateKey),
      mirrorNodeUrl,
    });
  }
}
