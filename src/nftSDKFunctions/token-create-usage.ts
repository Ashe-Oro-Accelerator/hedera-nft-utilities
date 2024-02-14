import { TokenCreateUsageProps, TokenCreateUsage } from '../types/estimate-create-collection';
import { getStringSize } from '../helpers/getStringSize';
import { DEFAULT_EXPIRATION_TIME } from '../utils/constants/fee-tool';

export const tokenCreateUsage = ({
  collectionName,
  collectionSymbol,
  keys,
  treasuryAccount,
}: TokenCreateUsageProps): TokenCreateUsage | undefined => {
  return {
    numSigsPayer: 1,
    numSigsTotal: treasuryAccount ? 2 : 1,
    numAdminKeys: keys?.admin ? 1 : 0,
    numKycKeys: keys?.KYC ? 1 : 0,
    numWipeKeys: keys?.wipe ? 1 : 0,
    numSupplyKeys: keys?.supply ? 1 : 0,
    numPauseKeys: keys?.pause ? 1 : 0,
    numFreezeKeys: keys?.freeze ? 1 : 0,
    expirationHours: DEFAULT_EXPIRATION_TIME,
    tokenNameSize: getStringSize(collectionName),
    tokenSymbolSize: getStringSize(collectionSymbol),
    memoSize: getStringSize(''),
    isAutoRenewAccountSet: false,
  };
};
