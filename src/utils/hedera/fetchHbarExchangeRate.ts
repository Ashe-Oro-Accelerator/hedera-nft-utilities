import { HbarExchangeRate } from '../../types/estimate-create-collection';
import { dictionary } from '../constants/dictionary';
import { getMirrorNodeUrlForNetwork } from './getMirrorNodeUrlForNetwork';
import axios from 'axios';

export const fetchHbarExchangeRate = async (network: string, mirrorNodeUrl?: string): Promise<HbarExchangeRate> => {
  try {
    const url = mirrorNodeUrl || getMirrorNodeUrlForNetwork(network);
    const { data } = await axios.get<HbarExchangeRate>(`${url}/network/exchangerate`);
    return data;
  } catch {
    throw new Error(dictionary.errors.cannotFetchHbarExchangeRate);
  }
};
