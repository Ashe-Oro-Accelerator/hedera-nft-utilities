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
import { getFullSystemPath } from '../../helpers/get-full-system-path';

export const dictionary = {
  errors: {
    unhandledError: 'Unknown error.',
    // file storages

    // pinata
    pinataError: 'Cannot create Pinata provider. Please pass pinataJwtKey OR (pinataApiKey AND pinataSecretApiKey).',

    awsUploadIssue: 'Error encountered using AWS SDK. Please restart the app and try again.',
    awsUploadingError: (message: string) => `Failed to upload file to AWS S3: ${message}`,

    // NFT storage
    noApiKeys: 'Please provide at least one API key to use "NFT.storage".',

    // upload service errors
    noFileStorageKeysFound: 'No file storage API keys found.',
    uploadingFilesFailed: 'Uploading files failed.',
    noFiles: 'No files to upload.',
    noMetadata: 'No metadata to upload.',

    uploadService: {
      uploadingMetadata: 'Uploading metadata file...',
    },
    cannotFetchHbarExchangeRate: 'Can not fetch Hbar exchange rate.',
    ipfsGatewayRequired: 'IPFS gateway is required when metadata contains IPFS links.',
    ipfsFailedToFetch: 'Failed to fetch metadata using IPFS gateway',
    tooManyRequests: (statusText: string, status: number) => `${statusText}. Status code: ${status}`,
    unknownErrorWhileFetching: (serialNumber: number) => `Error fetching metadata for serialNumber ${serialNumber}`,
  },

  createCollection: {
    clientRequired: 'client is required. You need to log in first.',
    myPrivateKeyRequired: 'myPrivateKey is required',
    collectionNameRequired: 'collectionName is required',
    collectionSymbolRequired: 'collectionSymbol is required',
    myAccountIdRequired: 'myAccountId is required',
    treasuryAccountPrivateKeySignRequired:
      'If you want to use treasuryAccount to sign, you need to pass the treasuryAccountPrivateKey also',
    collectionNotCreated: 'Something went wrong while creating the collection',
    autoRenewAccountPrivateKeySignRequired:
      'If you want to use autoRenewAccount to sign, you need to pass the autoRenewAccountPrivateKey also',
    tooManyCustomFees: 'You can only have 10 custom fees',
    collectorAccountIdRequired: 'collectorAccountId is required',
    numeratorRequired: 'numerator is required',
    denominatorRequired: 'denominator is required',
    hbarAmountOrAmountAndDenominatingToken:
      'Either hbarAmount should be set and both amount and denominatingTokenId should not be set, or amount and denominatingTokenId should be set and hbarAmount should not be set.',
  },
  validation: {
    errorInCellWithHeader: (line: number, column: number) =>
      `Error in line number ${line}, column number ${column}. Check if your CSV file is well prepared.`,
    invalidKeysDetected: (keys: string[]) => `Redundant key(s) detected: ['${keys.join("', '")}']`,
    csvFileIsEmpty: (path: string) => `No metadata found in CSV file "${getFullSystemPath(path)}".`,
    errorInRow: (line: number | string, error: string) =>
      `Error at: line number ${typeof line === 'number' ? line + 1 : line} in ${getFullSystemPath('exampleCSV.csv')}\n${error}`,
    missingAttributesInRow: (csvFilePath: string, row: number) => ` - "${getFullSystemPath(csvFilePath)}" in row ${row}`,
    imageForNftNotFound:
      'Image for NFT not found. The name of the image file should match its corresponding metadata file name (ex: 1.jpg with 1.json) or specify directly the "image" property.',
    mediaFileNotSupported: 'Media file is not supported.',
    arrayOfObjectsValidationError: (fileName: string, error: string) => `Error at: ${getFullSystemPath(fileName)} - ${error}`,
    unsupportedImageMimeType: 'Unsupported image MIME type.',
    requiredFieldMissing: 'Required field is missing',
    requiredTypeFieldIsMissing: 'The required "type" field is missing.',
    requiredAttributeFieldMissing: 'The required "attributes" field is missing.',
    filePermissionDenied: 'Permission denied',
    fileEmptyOrFormattingError: 'Unexpected end of JSON input',
    directoryIsEmpty: 'Directory is empty',
  },
  hederaActions: {
    clientRequired: 'client is required. You need to log in first.',
    myPrivateKeyRequired: 'myPrivateKey is required',
    collectionNameRequired: 'collectionName is required',
    collectionSymbolRequired: 'collectionSymbol is required',
    myAccountIdRequired: 'myAccountId is required',
    treasuryAccountPrivateKeySignRequired:
      'If you want to use treasuryAccount to sign, you need to pass the treasuryAccountPrivateKey also',
    collectionNotCreated: 'Something went wrong while creating the collection',
    mintingError: 'There was an error while minting the NFT.',
    maxBatchSize: 'Max Buffer exceeded. Use batchSize smaller of equal to 10',
    minBatchSize: 'Min Buffer exceeded. Use batchSize greater than 0',
    tokenIdRequired: 'tokenId is required',
    nftIdRequired: 'nftId is required',
    minAmount: 'Amount needs to be greater than 0',
    metadataRequired: 'metadata is required',
    supplyKeyRequired: 'supplyKey is required',
  },
  mintToken: {
    pathRequired: 'Path to File required',
    batchSizeUndefined: "batchSize can't be undefined",
    csvOrArrayRequired: 'Either pass a path to file(pathToMetadataURIsFile) or an array of strings(metadata)',
    tooLongCID: 'One of the CIDs is longer than 100 characters',
  },
} as const;
