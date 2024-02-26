import { getHolderAndDuration } from '../../nftSDKFunctions/get-holder-and-duration';
import axios from 'axios';

jest.mock('axios');

describe('getHolderAndDuration', () => {
  let mockAxios: jest.Mocked<typeof axios>;

  beforeEach(() => {
    mockAxios = axios as jest.Mocked<typeof axios>;
  });

  it('should return holder and duration', async () => {
    const mockTokenId = 'mockTokenId';
    const mockSerialNumber = 123;
    const mockNetwork = 'mockNetwork';

    const mockNFTDetails = { deleted: false };
    const mockTransactions = {
      transactions: [
        {
          type: 'CRYPTOTRANSFER',
          receiver_account_id: 'mockReceiverAccountId',
          consensus_timestamp: 'mockConsensusTimestamp',
        },
      ],
    };

    mockAxios.get.mockImplementationOnce(() => Promise.resolve({ data: mockNFTDetails }));
    mockAxios.get.mockImplementationOnce(() => Promise.resolve({ data: mockTransactions }));

    const result = await getHolderAndDuration({
      tokenId: mockTokenId,
      serialNumber: mockSerialNumber,
      network: mockNetwork,
    });

    expect(result).toEqual({
      holder: 'mockReceiverAccountId',
      holderSince: expect.any(String),
    });
  });

  it('should throw an error when the NFT has been deleted', async () => {
    const mockTokenId = 'mockTokenId';
    const mockSerialNumber = 123;
    const mockNetwork = 'mockNetwork';

    const mockNFTDetails = { deleted: true };

    mockAxios.get.mockImplementationOnce(() => Promise.resolve({ data: mockNFTDetails }));

    await expect(
      getHolderAndDuration({
        tokenId: mockTokenId,
        serialNumber: mockSerialNumber,
        network: mockNetwork,
      })
    ).rejects.toThrow('NFT has been deleted');
  });

  it('should throw an error when there are no transactions for the NFT', async () => {
    const mockTokenId = 'mockTokenId';
    const mockSerialNumber = 123;
    const mockNetwork = 'mockNetwork';

    const mockNFTDetails = { deleted: false };
    const mockTransactions = { transactions: [] };

    mockAxios.get.mockImplementationOnce(() => Promise.resolve({ data: mockNFTDetails }));
    mockAxios.get.mockImplementationOnce(() => Promise.resolve({ data: mockTransactions }));

    await expect(
      getHolderAndDuration({
        tokenId: mockTokenId,
        serialNumber: mockSerialNumber,
        network: mockNetwork,
      })
    ).rejects.toThrow('NFT has not been transferred');
  });
});
