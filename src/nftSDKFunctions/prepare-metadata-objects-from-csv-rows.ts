import { JsonMetadataFromCSVConverter } from '../services/json-metadata-from-csv-converter';
import { CSVRow } from '../types/csv';
import { ATTRIBUTES, PROPERTIES } from '../utils/constants/csv-constants';

export const prepareMetadataObjectsFromCSVRows = ({ csvParsedRows, csvFilePath }: { csvParsedRows: CSVRow[]; csvFilePath?: string }) => {
  const metadataObjects = JsonMetadataFromCSVConverter.parseCSVRowsToMetadataObjects({
    csvParsedRows,
    csvFilePath,
    headerAttributes: ATTRIBUTES,
    headerProperties: PROPERTIES,
  });

  return metadataObjects;
};
