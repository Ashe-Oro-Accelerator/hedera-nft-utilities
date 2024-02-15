import { nftSDK, operatorPrivateKey } from './e2e-consts';
import { PrivateKey } from '@hashgraph/sdk';
import { LONG_E2E_TIMEOUT } from '../__mocks__/consts';
import { mintToken } from '../../nftSDKFunctions/mint-token';
import { estimateNftMintingCostFunction } from '../../nftSDKFunctions/estimate-nft-minting-cost-function';
import { AVERAGE_COST_OF_MINT_1_AVERAGE_METADATA_JSON } from '../../utils/constants/minting';

describe('mintSharedMetadata function e2e', () => {
  const testCases = [{ amount: 1 }, { amount: 3 }, { amount: 10 }];

  testCases.forEach(({ amount }) => {
    it(
      `Creating a token and minting ${amount} NFTs into it. Then checking estimated cost`,
      async () => {
        const tokenId = await nftSDK.createCollection({
          collectionName: 'test_name',
          collectionSymbol: 'test_symbol',
        });

        const mintTokenReceipt = await mintToken(
          new Array(amount).fill('www.youtube.com'),
          tokenId,
          PrivateKey.fromString(operatorPrivateKey),
          nftSDK.client
        );
        const exchangeRateInDollars = mintTokenReceipt.exchangeRate!.exchangeRateInCents / 100;

        const estimatedCost = await estimateNftMintingCostFunction({
          amountOfNfts: amount,
          network: 'testnet',
        });

        expect(tokenId).toBeDefined();
        expect(mintTokenReceipt).toBeDefined();
        expect((mintTokenReceipt.totalSupply.toString() * AVERAGE_COST_OF_MINT_1_AVERAGE_METADATA_JSON) / exchangeRateInDollars).toEqual(
          estimatedCost
        );
      },
      LONG_E2E_TIMEOUT
    );
  });
});
