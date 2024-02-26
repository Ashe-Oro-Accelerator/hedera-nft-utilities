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
import { Validator, defaultSchemaVersion } from './validator';
import localValidation from './local-validation';
import { defaultWeights, defaultRiskLevels, calculateRiskScoreFromData, calculateRiskScoreFromTokenId, calculateRiskLevel } from './risk';
import { calculateRarity, calculateRarityFromData, calculateTraitOccurrenceFromData, calculateRarityFromOnChainData } from './rarity';

import { Attribute, Localization, File, Instance, Error, Problem, ValidationResult, Schema } from './types/validator.module';
import { NFTFile, NFTAttribute, ValueObject, AttributeConfig, RarityResult, TraitOccurrence } from './types/rarity.module';
import { WeightKeys, WeightProperties, Weights, KeyTypes, RiskLevels, RiskLevelTypes, Metadata, RiskResult } from './types/risk.module';

import { HederaNFTSDK } from './nftSDKFunctions';
import { FeeFactory } from './feeFactory';
import { NftStorageService } from './services/file-storages/nft-storage/nft-storage-service';
import { PinataService } from './services/file-storages/pinata/pinata-service';
import { AWSService } from './services/file-storages/aws/aws-service';
import { MockStorageService } from './services/file-storages/mock-storage/mock-storage-service';
import { UploadService } from './services/upload-service';

export {
  // validation
  Validator,
  defaultSchemaVersion,

  // local validation
  localValidation,

  // risk score
  defaultWeights,
  defaultRiskLevels,
  calculateRiskScoreFromData,
  calculateRiskScoreFromTokenId,
  calculateRiskLevel,

  // rarity calculation
  calculateRarity,
  calculateRarityFromData,
  calculateTraitOccurrenceFromData,
  calculateRarityFromOnChainData,

  // interfaces
  Attribute,
  Localization,
  File,
  Instance,
  Error,
  Problem,
  ValidationResult,
  Schema,
  NFTFile,
  NFTAttribute,
  ValueObject,
  AttributeConfig,
  RarityResult,
  WeightKeys,
  WeightProperties,
  Weights,
  KeyTypes,
  RiskLevels,
  RiskLevelTypes,
  Metadata,
  RiskResult,
  TraitOccurrence,

  // NFTSDK
  HederaNFTSDK,
  FeeFactory,

  // Upload Service
  UploadService,

  // Storages
  NftStorageService,
  PinataService,
  AWSService,
  MockStorageService,
};
