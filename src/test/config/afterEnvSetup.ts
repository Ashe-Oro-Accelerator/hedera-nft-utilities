import { nftSDK } from '../e2e/e2e-consts';

afterAll(() => {
  nftSDK.client.close();
});
