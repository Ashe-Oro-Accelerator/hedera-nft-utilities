import { Blob } from 'buffer';

export const getStringSize = (str?: string): number => {
  if (!str) return 0;
  return new Blob([str]).size;
};
