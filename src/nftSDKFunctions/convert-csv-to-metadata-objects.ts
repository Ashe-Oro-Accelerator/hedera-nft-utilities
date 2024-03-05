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
import { CSVFileReader } from '../csv-file-reader';
import { MetadataObject } from '../types/csv';
import { prepareMetadataObjectsFromCSVRows } from './prepare-metadata-objects-from-csv-rows';

export const convertCSVToMetadataObjects = async (csvFilePath: string, limit?: number): Promise<MetadataObject[]> => {
  const csvParsedRows = await CSVFileReader.readCSVFile(csvFilePath, limit);
  const metadataObjects = prepareMetadataObjectsFromCSVRows({ csvParsedRows });

  return metadataObjects;
};
