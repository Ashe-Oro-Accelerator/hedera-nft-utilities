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
import { myAccountId, mySecondAccountId } from '../__mocks__/consts';
import { dictionary } from '../../utils/constants/dictionary';
import { feeFactoryInstance } from '../e2e/e2e-consts';
import { estimateCreateCollectionInHbar } from '../../nftSDKFunctions/estimate-create-collection-in-hbar';

const expectToBeCloseToWithinMargin = (actual: number, expected: number, margin: number = 0.03) => {
  const difference = Math.abs(actual - expected);
  const acceptableDifference = Math.abs(expected * margin);
  expect(difference).toBeLessThanOrEqual(acceptableDifference);
};

describe('estimateCreateCollectionInHbars', () => {
  it('should work properly with default values', async () => {
    const hbars = await estimateCreateCollectionInHbar({
      collectionName: 'test',
      network: 'testnet',
      collectionSymbol: 'test2',
    });

    expectToBeCloseToWithinMargin(hbars, 10.374939759036144);
  });

  it('should work properly with royalty fee', async () => {
    const royaltyFee = feeFactoryInstance.royaltyFee({
      collectorAccountId: myAccountId,
      numerator: 11,
      denominator: 100,
      allCollectorsAreExempt: false,
      fallbackFee: {
        allCollectorsAreExempt: false,
        collectorAccountId: mySecondAccountId,
        hbarAmount: 100,
      },
    });

    const hbars = await estimateCreateCollectionInHbar({
      collectionName: 'test',
      network: 'testnet',
      collectionSymbol: 'test2',
      customFees: [royaltyFee],
    });

    expectToBeCloseToWithinMargin(hbars, 20.766144578313252);
  });

  it('should work properly with fixed fees', async () => {
    const fixedFee = feeFactoryInstance.fixedFee({
      allCollectorsAreExempt: false,
      collectorAccountId: myAccountId,
      hbarAmount: 100,
    });

    const hbars = await estimateCreateCollectionInHbar({
      collectionName: 'test',
      network: 'testnet',
      collectionSymbol: 'test2',
      customFees: [fixedFee, fixedFee],
    });

    expectToBeCloseToWithinMargin(hbars, 20.77578313253012);
  });

  it('should throw an error when invalid parameters are passed', async () => {
    await expect(
      estimateCreateCollectionInHbar({
        collectionName: '',
        collectionSymbol: '',
        treasuryAccount: '',
        treasuryAccountPrivateKey: '',
        network: 'testnet',
        customFees: [],
      })
    ).rejects.toThrow(dictionary.createCollection.collectionSymbolRequired);
  });
});
