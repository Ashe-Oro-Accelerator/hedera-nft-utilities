import { CSVFileReader } from '../csv-file-reader';
import { JsonMetadataFromCSVConverter } from '../services/json-metadata-from-csv-converter';
import { JsonMetadataFromCSVInterface } from '../types/json-metadata-from-csv.module';
import { Hip412Validator } from '../hip412-validator';

export const createJsonMetadataFromCSV = async ({
  savedJsonFilesLocation,
  csvFilePath,
  nftsLimit,
}: {
  savedJsonFilesLocation: string;
  csvFilePath: string;
  nftsLimit?: number;
}): Promise<JsonMetadataFromCSVInterface> => {
  const csvParsedRows = await CSVFileReader.readCSVFile(csvFilePath, {
    limit: nftsLimit,
  });

  const metadataObjectsFromCSVRows = JsonMetadataFromCSVConverter.parseCSVRowsToMetadataObjects({
    csvParsedRows,
    csvFilePath,
    headerAttributes: CSVFileReader.ATTRIBUTES,
    headerProperties: CSVFileReader.PROPERTIES,
  });

  const { isValid, errors } = Hip412Validator.validateArrayOfObjects(metadataObjectsFromCSVRows, csvFilePath);

  if (isValid) {
    JsonMetadataFromCSVConverter.saveCSVRowsAsJsonFiles(metadataObjectsFromCSVRows, savedJsonFilesLocation);
  }

  return {
    isValid,
    errors,
    savedJsonFilesLocation,
  };
};
