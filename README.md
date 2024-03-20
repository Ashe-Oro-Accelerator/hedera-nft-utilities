<div align="center">

# Hedera NFT Utilities

[![License](https://img.shields.io/badge/license-apache2-blue.svg)](LICENSE)

</div>

This package includes all sorts of tooling for the Hedera NFT ecosystem, including:

1. **Token metadata validation:** Verify your metadata against the [token metadata JSON schema V2](https://github.com/hashgraph/hedera-improvement-proposal/blob/main/HIP/hip-412.md) for NFTs, which returns errors and warnings against the standard. You can also define your own token metadata standard and add it to the package to use this schema for validation.
2. **Local metadata validator:** Verify a local folder containing multiple JSON metadata files against the standard before publishing the NFT collection on the Hedera network.
3. **Risk score calculation:** Calculate a risk score for an NFT collection from the token information or by passing a token ID of an NFT on the Hedera testnet or mainnet.
4. **Rarity score calculation:** Calculate the rarity scores for a local folder containing multiple JSON metadata files for an NFT collection.
5. **Trait occurrence calculation:**
6. **Hip412Validator:** A tool for validating metadata objects according to HIP-412, providing comprehensive verification of metadata compliance with the selected standard.

## Table of Contents

- **How to build the package**
- **Package: [Token metadata validator](#token-metadata-validator)**
- **Package: [Local metadata validator](#local-validator)**
- **Package: [Risk score calculation](#risk-score-calculation)**
- **Package: [Rarity score calculation](#rarity-score-calculation)**
- **Package: [Trait occurrence calculation](#trait-occurrence-calculation)**
- **Package: [NFTSDK](#nft-sdk-functions)**
- **Package: [Hip412Validator](#hip412-validator)**
- **[Questions, contact us, or improvement proposals?](#questions-or-improvement-proposals)**
- **[Support](#Support)**
- **[Contributing](#Contributing)**
- **[Code of Conduct](#Code-of-Conduct)**
- **[License](#License)**

## How to build the package?

To build this package, run the below command:

```sh
npm run build
```

This command will produce a `dist` folder containing the outputted JavaScript files.

## Token metadata validator

Verify your metadata against the [token metadata V2 standard](https://github.com/hashgraph/hedera-improvement-proposal/blob/main/HIP/hip-412.md) for NFTs which returns errors and warnings against the standard.

### Usage

Install the package:

```bash
npm i -s @hashgraph/nft-utilities
```

Import the package into your project. You can import the `Validator` class and the default schema version for token metadata with `defaultSchemaVersion`.

```js
const { Validator, defaultSchemaVersion } = require('@hashgraph/nft-utilities');
```

You can use the `Validator` like below.

1. The first parameter is the JSON object you want to verify against a JSON schema
2. The second parameter is the version of the token metadata JSON schema against which you want to validate your metadata instance. The default value is `2.0.0` (V2). In the future, new functionality might be added, releasing new version numbers.

```js
const metadata = {
  attributes: [{ trait_type: 'Background', value: 'Yellow' }],
  creator: 'NFT artist',
};
const version = '2.0.0';

const validator = new Validator();
const issues = validator.validate(metadata, version);
```

### Interface

The output interface for issues contains `errors` and `warnings`.

```json
{
  "errors": [
    {
      "type": "Indicates which validator created the error. Possible values: schema, attribute, localization, and SHA256.",
      "msg": "Indicates the specific error explanation to be displayed to the user",
      "path": "Indicates the path of the property for which the error is returned"
    }
  ],
  "warnings": [
    {
      "type": "schema",
      "msg": "is not allowed to have the additional property 'someAdditionalProperty'",
      "path": "Indicates the path of the property for which the error is returned"
    }
  ]
}
```

Here's an example:

```json
{
  "errors": [
    {
      "type": "attribute",
      "msg": "Trait stamina of type 'percentage' must be between [0-100], found 157",
      "path": "instance.attributes[0]"
    }
  ],
  "warnings": [
    {
      "type": "schema",
      "msg": "is not allowed to have the additional property 'imagePreview'",
      "path": "instance"
    }
  ]
}
```

### Examples

See: **[/examples/token-metadata-validator](https://github.com/hashgraph/hedera-nft-utilities/tree/main/examples/token-metadata-validator)**

### Add custom schema versions

#### Method 1: Use Validator constructor to pass custom schemas

The easiest approach to adding new schemas is using the constructor of the `Validator` class. It accepts an array of JSON objects, each containing a JSON schema and tag for the schema. The tag is used to refer to the schema when validating metadata instances.

Therefore, each tag needs to be unqiue. The following tags can't be used as they are already occupied:

- `1.0.0` -> Refers to token metadata JSON schema V1 (HIP10)
- `2.0.0` -> Refers to token metadata JSON schema V2 (HIP412)

You can add your custom schema like this:

```js
const { Validator } = require('@hashgraph/nft-utilities');

// Define your schema
const customSchema = {
  title: 'Token Metadata',
  type: 'object',
  additionalProperties: false,
  properties: {
    name: {
      type: 'string',
      description: 'Identifies the asset to which this token represents.',
    },
  },
  required: ['name'],
};

// Create Validator instance with custom schema labeled "custom-v1"
const validator = new Validator([{ schemaObject: customSchema, tag: 'custom-v1' }]);

// Verify metadata against custom schema
const results = validator.validate(metadataInstance, 'custom-v1');
console.log(results);
```

**Examples:** See: [/examples/token-metadata-calculation](https://github.com/hashgraph/hedera-nft-utilities/tree/main/examples/token-metadata-calculation/custom-schema-valid-metadata.js)

#### Method 2: Rebuilding package

> ⚠️ Warning: **This approach requires you to rebuild the package.**

You can add custom JSON schemas to the `/schemas` folder.

You can then add the version to the `schemaMap` in `/schema/index.js` using the following code:

```js
const token_metadata_2_0_0 = require('./HIP412@2.0.0.json');
const myCustomSchema = require('./myschema.json'); // import your schema

const schemaMap = new Map();
schemaMap.set('2.0.0', token_metadata_2_0_0);
schemaMap.set('<version>', myCustomSchema); // Add your schema to the map
```

When you've added your schema to the map, you can validate against your schema version by passing your version to the `validator()` function.

### Add custom validation rules

Set custom validation rules by importing new validators from the `/validators` folder into the `index.js` file. You can then add them to the `validate()` function. Stick to the `issues` format of errors and warnings (see section "Issues format" for the detailed description).

```js
const { myCustomValidator, schemaValidator } = require('./validators');

const validate = (instance, schemaVersion = defaultSchemaVersion) => {
  let errors = [];
  let warnings = [];

  const schema = this.getSchema(schemaVersion);

  // When errors against the schema are found, you don't want to continue verifying the NFT
  // Warnings don't matter because they only contain "additional property" warnings that don't break the other validators
  const schemaProblems = schemaValidator(instance, schema);
  warnings.push(...schemaProblems.warnings);
  if (schemaProblems.errors.length > 0) {
    errors.push(...schemaProblems.errors);

    return {
      errors,
      warnings,
    };
  }

  const customErrors = myCustomValidator(instance);
  errors.push(...customErrors);

  return {
    errors,
    warnings,
  };
};
```

## Local validator

Verify a local folder containing multiple JSON metadata files against the standard before publishing the NFT collection on the Hedera network.

### Usage

Install the package:

```bash
npm i -s @hashgraph/nft-utilities
```

Import the package into your project and get the `localValidation` function.

```js
const { localValidation } = require('@hashgraph/nft-utilities');
```

The `localValidation` expects an absolute path to your metadata files to verify them. The function prints the warnings and errors for all JSON files it finds in the provided folder path. It also returns the validation results as an object in case you want to use the results in your code.

```js
localValidation('/Users/projects/nft/files');
```

This package uses the `Validator` class explained in the [previous section](#token-metadata-validator).

### Interface

The output interface for this function looks like this.

```json
{
    "filename.json": {
        "errors": [
            {
                "type": "Indicates which validator created the error. Possible values: schema, attribute, localization, and SHA256.",
                "msg": "Indicates the specific error explanation to be displayed to the user",
                "path": "Indicates the path of the property for which the error is returned"
            }
        ],
        "warnings": [
            {
                "type": "schema",
                "msg": "is not allowed to have the additional property 'someAdditionalProperty'",
                "path": "Indicates the path of the property for which the error is returned"
            }
        ]
    },
    "filename2.json": ...
}
```

### Examples

See: **[/examples/local-metadata-validator/index.js](https://github.com/hashgraph/hedera-nft-utilities/tree/main/examples/local-metadata-validator)**

## Risk score calculation

Calculate risk score for a token from the token information or by passing a token ID of an NFT on the Hedera testnet or mainnet.

The total risk score is calculated based on the presence of certain `keys` for the token or the presence of an `INFINITE` `supply_type` in combination with a `supply_key`. Each key or property has an associated weight.

```js
const defaultWeights = {
  keys: {
    admin_key: 200,
    wipe_key: 200,
    freeze_key: 50,
    supply_key: 20,
    kyc_key: 50,
    pause_key: 50,
    fee_schedule_key: 40,
  },
  properties: {
    supply_type_infinite: 20,
  },
};
```

However, there's one edge case where the 20 weight for the supply key is not counted. When the supply type is set to `FINITE` and the total supply equals the max supply, there's no risk the supply key can further dilute the project because the project's minting limit has been reached.

To determine the risk level, there are four categories each with an attached score. If the score is lower than or equal to a risk level, it will get that risk level. E.g. a token with a risk score of 200 will get a `HIGH` risk level.

```js
const defaultRiskLevels = {
  NORISK: 0,
  LOW: 40,
  MEDIUM: 199,
  HIGH: 200,
};
```

### Usage

Install the package:

```bash
npm i -s @hashgraph/nft-utilities
```

Import the package into your project and get the `calculateRiskScoreFromData` or `calculateRiskScoreFromTokenId` functions.

```js
const { calculateRiskScoreFromData, calculateRiskScoreFromTokenId } = require('@hashgraph/nft-utilities');
```

The `calculateRiskScoreFromData` expects a token information JSON object as returned by the [/api/v1/tokens/<token-id> endpoint](https://docs.hedera.com/hedera/docs/mirror-node-api/rest-api#response-details-6) (here's an [example of token data](https://mainnet-public.mirrornode.hedera.com/api/v1/tokens/0.0.1270555/)).

```js
const tokenInformation = {
        "admin_key": null,
        "auto_renew_account": "0.0.784037", "auto_renew_period": 7776000,
        "freeze_key": null,
        ...
}

const results = calculateRiskScoreFromData({ metadata: tokenInformation });
```

Alternatively, use the `calculateRiskScoreFromTokenId` to retrieve risk information about a token by entering a token ID. This asynchronous function looks up the token information from the mirror node and returns the risk information.

```js
const results = await calculateRiskScoreFromTokenId({ tokenId: '0.0.1270555' });
```

### Custom weights and risk levels

Use custom weights and risk levels by passing them as the second and third parameter to the `calculateRiskScoreFromData` function.

```js
const metadata: Metadata = {
  supply_type: 'testSupply',
  supply_key: 'testKey',
  max_supply: 'testMaxSupply',
  total_supply: 'testTotalSupply',
};

const customWeights: Weights = {
  keys: {
    admin_key: 200,
    wipe_key: 200,
    freeze_key: 50,
    supply_key: 20,
    kyc_key: 50,
    pause_key: 50,
    fee_schedule_key: 40,
  },
  properties: {
    supply_type_infinite: 20,
  },
};

const customRiskLevels: RiskLevels = {
  NORISK: 0,
  LOW: 40,
  MEDIUM: 199,
  HIGH: 200,
};

const results = calculateRiskScoreFromData({ metadata, customWeights, customRiskLevels });
```

### Interface

The output interface for this function looks like this.

```json
{
  "riskScore": "number representing total risk score",
  "riskLevel": "<string: ENUM(NORISK, LOW, MEDIUM, HIGH)>"
}
```

### Examples

See: **[/examples/risk-score-calculation](https://github.com/hashgraph/hedera-nft-utilities/tree/main/examples/risk-score-calculation)**

## Rarity score calculation

Calculate the rarity for a local folder containing multiple JSON metadata files for an NFT collection. This package uses the trait normalization rarity scoring model because it's the fairest model to calculate rarity.
The model works by dividing the number one by the division of the number of NFTs with a specific trait value and the number of NFTs with the most common trait value for that trait. Here's the formula:

```
1 / (# of NFTs with trait value / # of NFTs with most common trait value)
```

This model outputs a score for each NFT. By sorting the NFTs, you'll get a ranking based on this scoring model.

### Usage

Install the package:

```bash
npm i -s @hashgraph/nft-utilities
```

Import the package into your project and get `calculateRarity` function. Next, you need to pass an absolute path to a folder containing metadata JSON files.

```js
const { calculateRarity } = require('@hashgraph/nft-utilities');

const absolutePathToFiles = '/Users/myUser/nft-utilities/examples/rarity-score-calculation/files';
const results = calculateRarity(absolutePathToFiles);
console.log(results);
```

You can also avoid having to load data from files by using the `calculateRarityFromData` function.

```js
const NFTdata = [
  {
    name: 'HANGRY BARBOON #2343',
    image: 'ipfs://QmaHVnnp7qAmGADa3tQfWVNxxZDRmTL5r6jKrAo16mSd5y/2343.png',
    type: 'image/png',
    attributes: [
      { trait_type: 'Background', value: 'Yellow' },
      { trait_type: 'Fur', value: 'Silver' },
      { trait_type: 'Clothing', value: 'Herbal Jacket' },
      { trait_type: 'Mouth', value: 'Smile' },
      { trait_type: 'Sing', value: 'Sing' },
    ],
  },
];

const results = calculateRarityFromData(NFTdata);
```

According to token metadata JSON schema V2, the `calculateRarity` function only looks at objects in the `attributes` property that use the following format:

```
{ "trait_type": "Background", "value": "Yellow" }
```

It does not take into account attributes with the `display_type` property set, like this:

```
{ "trait_type": "Background", "value": 10, "display_type": "percentage" }
```

### Interface

The output interface for this function looks like this.

```json
[
    { "rarity": "<string> rarity score", "NFT": "<nubmer> NFT number", "filename": "<string optional>" },
    ...
]
```

Here's a sample output. The total sum of the individual attributes is always 100%.

```
[
    {
        "attributeContributions": [
            {
                "trait": "Background",
                "value": "Yellow",
                "contribution": "18.18"
            },
            {
                "trait": "Fur",
                "value": "Gold",
                "contribution": "18.18"
            },
            {
                "trait": "Clothing",
                "value": "Floral Jacket",
                "contribution": "18.18"
            },
            {
                "trait": "Mouth",
                "value": "Tongue",
                "contribution": "27.27"
            },
            {
                "trait": "Sing",
                "value": "None",
                "contribution": "18.18"
            }
        ],
        "totalRarity": "5.50",
        "NFT": 1,
        "filename": "nft1.json"
    },
    ...
]
```

### Examples

See:

- **[/examples/rarity-score-calculation/rarity-from-files.js](https://github.com/hashgraph/hedera-nft-utilities/tree/main/examples/rarity-score-calculation)**
- **[/examples/rarity-score-calculation/rarity-from-data.js](https://github.com/hashgraph/hedera-nft-utilities/tree/main/examples/rarity-score-calculation)**

## Trait occurrence calculation

Calculate how often different values for a given trait occur in a collection, percentage-based.

### Usage

Install the package:

```bash
npm i -s @hashgraph/nft-utilities
```

Import the package into your project and get `calculateTraitOccurrenceFromData` function. Next, you need to pass a JSON array containing NFT collection metadata to the function.

```js
const NFTdata = [
    {
        "creator": "HANGRY BARBOONS",
        "description": "HANGRY BARBOONS are 4,444 unique citizens from the United Hashgraph of Planet Earth. Designed and illustrated by President HANGRY.",
        "format": "none",
        "name": "HANGRY BARBOON #2343",
        "image": "ipfs://QmaHVnnp7qAmGADa3tQfWVNxxZDRmTL5r6jKrAo16mSd5y/2343.png",
        "type": "image/png",
        "properties": { "edition": 2343 },
        "attributes": [
          { "trait_type": "Background", "value": "Yellow" },
          { "trait_type": "Mouth", "value": "Nose" }
        ]
    },
    ...
  ]

  const results = calculateTraitOccurrenceFromData(NFTdata);
```

### Interface

The output interface for this function looks like this.

```json
[
    {
        "trait": "<string> trait name",
        "values": [
            {
                "value": "<string> single value for trait",
                "occurrence": "<string> percentage based occurrence with 2 digits after comma"
            },
            ...
        ]
    },
    ...
]
```

Here's a sample output that shows the percentage of each value's occurrence for a given trait.

```
[
    {
        "trait": "Background",
        "values": [
            {
                "value": "Yellow",
                "occurence": "60.00"
            },
            {
                "value": "Green",
                "occurence": "40.00"
            }
        ]
    },
    {
        "trait": "Mouth",
        "values": [
            {
                "value": "Nose",
                "occurence": "20.00"
            },
            {
                "value": "Tongue",
                "occurence": "20.00"
            },
            {
                "value": "Smile",
                "occurence": "60.00"
            }
        ]
    }
]
```

### Examples

See:

- **[/examples/rarity-score-calculation/trait-occurrence-from-data.js](https://github.com/hashgraph/hedera-nft-utilities/tree/main/examples/rarity-score-calculation)**

## NFT SDK functions

Each of NFtSDK function are methods in class `NFTSDK` which is a wrapper around the Hedera NFT API. The class is used to create a new NFT collection, mint NFTs, and transfer NFTs.

### Usage

Install the package:

```bash
npm i -s @hashgraph/nft-utilities
```

Create new instance of `NFTSDK` class by passing the operator account ID, operator private key, and network to the constructor.
HederaNFTSDK class has login function in constructor which logs in the operator account and sets the operator account ID and operator private key.
You should create this instance only once. Every exported function will be automatically logged in with the operator account.

```js
new HederaNFTSDK(operatorAccountId, operatorPrivateKey, 'testnet');
```

### Parameters

Create collection method takes in the following parameters:

```typescript
type CreateCollectionType = {
  accountId: string;
  privateKey: string;
  network: Network;
  localNode?: LocalNode;
  localMirrorNode?: string;
  mirrorNodeUrl?: string;
};
```

- `accountId`: The account ID of the operator account.
- `privateKey`: The private key of the operator account.
- `network`: The network to use (mainnet or testnet or previewnet).
- `localNode`: The local node to use.
- `localMirrorNode`: The local mirror node to use.
- `mirrorNodeUrl`: The mirror node URL to use.

## NFT SDK Create Collection

The `create-collection` method is used to create a new NFT collection. This method takes in a collection name and an array of NFT metadata objects and returns a promise that resolves when the collection is successfully created.

### Usage

Install the package:

```bash
npm i -s @hashgraph/nft-utilities
```

Create instance of `NFTSDK` class and call `createCollection` method by passing the collection name and an array of NFT metadata objects.

```js
const nftSDK = new HederaNFTSDK(operatorAccountId, operatorPrivateKey, 'testnet');

const tokenId = await nftSDK.createCollection({
  collectionName: 'test_name',
  collectionSymbol: 'test_symbol',
});
```

### Parameters

Create collection method takes in the following parameters:

```typescript
type CreateCollectionType = {
  collectionName: string;
  collectionSymbol: string;
  treasuryAccountPrivateKey?: string;
  treasuryAccount?: string;
  keys?: CreateCollectionKeysType;
  maxSupply?: number;
  customFees?: CustomFeeType[];
  expirationTime?: Date;
  autoRenewAccount?: string;
  autoRenewAccountPrivateKey?: string;
  autoRenewPeriod?: number;
  memo?: string;
};
```

- `collectionName`: The name of the NFT collection.
- `collectionSymbol`: The symbol of the NFT collection.
- `treasuryAccountPrivateKey`: The private key of the treasury account. If not provided, the operator account will be used.
- `treasuryAccount`: The treasury account ID. If not provided, the operator account will be used.
- `keys`: The keys for the collection.
- `maxSupply`: The maximum supply of the collection.
- `customFees`: The custom fees for the collection.
- `expirationTime`: The expiration time of the collection.
- `autoRenewAccount`: The auto-renew account for the collection.
- `autoRenewAccountPrivateKey`: The private key of the auto-renew account.
- `autoRenewPeriod`: The auto-renew period for the collection.
- `memo`: The memo for the collection.

### Output

Method return string which is the token ID of the newly created NFT collection.

### Examples

See: **[/examples/local-metadata-validator/index.js](https://github.com/hashgraph/hedera-nft-utilities/tree/main/examples/local-metadata-validator)**

## NFT SDK Estimate Create Collection In Dolars

The `estimateCreateCollectionInDollars` method is used to estimate the cost of creating a new NFT collection. This method takes in a collection name and an array of NFT metadata objects and returns a promise that resolves when the cost is successfully estimated.

### Usage

Install the package:

```bash
npm i -s @hashgraph/nft-utilities
```

Create instance of `NFTSDK` class and call `estimateCreateCollectionInDollars` method by passing the collection name and an array of NFT metadata objects.

```js
const nftSDK = new HederaNFTSDK(operatorAccountId, operatorPrivateKey, 'testnet');

const estimatedDollars = estimateCreateCollectionInDollars({
  collectionName: 'test',
  collectionSymbol: 'test2',
});
```

### Parameters

Create collection method takes in the following parameters:

```typescript
type EstimateCreateCollectionInDollarsType = {
  collectionName: string;
  collectionSymbol: string;
  treasuryAccountPrivateKey?: string;
  treasuryAccount?: string;
  keys?: CreateCollectionKeysType;
  customFees?: CustomFeeType[];
};
```

- `collectionName`: The name of the NFT collection.
- `collectionSymbol`: The symbol of the NFT collection.
- `treasuryAccountPrivateKey`: The private key of the treasury account. If not provided, the operator account will be used.
- `treasuryAccount`: The treasury account ID. If not provided, the operator account will be used.
- `keys`: The keys for the collection.
- `customFees`: The custom fees for the collection.

### Output

Method return number which is the estimated cost of creating a new NFT collection in dollars.

### Examples

See: **[/examples/local-metadata-validator/index.js](https://github.com/hashgraph/hedera-nft-utilities/tree/main/examples/local-metadata-validator)**

## NFT SDK Estimate Create Collection In Hbar

The `estimateCreateCollectionInHbar` method is used to estimate the cost of creating a new NFT collection. This method takes in a collection name and an array of NFT metadata objects and returns a promise that resolves when the cost is successfully estimated.

### Usage

Install the package:

```bash
npm i -s @hashgraph/nft-utilities
```

Create instance of `NFTSDK` class and call `estimateCreateCollectionInHbar` method by passing the collection name and an array of NFT metadata objects.

```js
const nftSDK = new HederaNFTSDK(operatorAccountId, operatorPrivateKey, 'testnet');

const estimatedDollars = estimateCreateCollectionInHbar({
  collectionName: 'test',
  collectionSymbol: 'test2',
});
```

### Parameters

Create collection method takes in the following parameters:

```ts
type EstimateCreateCollectionInDollarsType = {
  collectionName: string;
  collectionSymbol: string;
  treasuryAccountPrivateKey?: string;
  treasuryAccount?: string;
  keys?: CreateCollectionKeysType;
  customFees?: CustomFeeType[];
};
```

- `collectionName`: The name of the NFT collection.
- `collectionSymbol`: The symbol of the NFT collection.
- `treasuryAccountPrivateKey`: The private key of the treasury account. If not provided, the operator account will be used.
- `treasuryAccount`: The treasury account ID. If not provided, the operator account will be used.
- `keys`: The keys for the collection.
- `customFees`: The custom fees for the collection.

### Output

Method return number which is the estimated cost of creating a new NFT collection in dollars.

### Examples

See: **[/examples/local-metadata-validator/index.js](https://github.com/hashgraph/hedera-nft-utilities/tree/main/examples/local-metadata-validator)**

<br>

## HIP 412 VALIDATOR

The `Hip412Validator` class is a comprehensive tool designed to facilitate the validation of NFT metadata against the standards outlined in the Hedera Improvement Proposal (HIP) 412. This class provides developers with a suite of methods to validate individual NFT metadata objects, arrays of metadata, local files, and directories containing NFT metadata, ensuring compliance with the HIP-412 schema. Additionally, it offers functionalities to validate metadata directly from the Hedera network, providing a robust solution for ensuring the integrity and compliance of NFT metadata within the Hedera ecosystem.

### Methods & Initialization

The class methods can be directly invoked to perform metadata validation.

1. `validateSingleMetadataObject` - Validates a single NFT metadata object against the HIP-412 schema.

### Usage

```js
const validationResult = Hip412Validator.validateSingleMetadataObject(metadataObject);
```

### Output

This method returns an object contains:

- `isValid` boolean flag
- Array of errors

---

2. `validateArrayOfObjects` - Takes an array of metadata objects and validates each one against the HIP-412 schema, providing detailed results for each object.

```js
const validationResults = Hip412Validator.validateArrayOfObjects(arrayOfMetadataObjects);
```

### Output

This method returns an object contains:

`isValid`: A boolean flag indicating whether the metadata object at the index passed validation,
`errors`: An array of strings listing all validation errors found for the metadata object,
`errorsCount`: The number of errors found for the metadata object,
`allObjectsValid`: A boolean flag indicating whether all metadata objects in the array passed validation without any errors.

---

3. `validateLocalFile` - This method allows for the validation of metadata within a local file. It reads the file content, parses the JSON, and validates it against the HIP-412 schema.

```js
const pathToFile = 'path/to/your/file';
const fileValidationResult = Hip412Validator.validateLocalFile(pathToFile);
```

### Output

This method returns an object contains:

- `isValid` boolean flag
- Array of errors

---

4. `validateLocalDirectory` - Validates all JSON metadata files within a specified directory, offering a comprehensive tool for pre-publish validation of NFT collections.

```js
const directoryPath = 'path/to/your/metadata/directory';
const directoryValidationResult = Hip412Validator.validateLocalDirectory(directoryPath);
```

### Output

This method returns an object contains:

- `isValid`: A boolean flag indicating whether all files within the specified directory passed validation. It is true if all files are valid according to the HIP-412 schema, and false otherwise.
- `errors`: An array of MetadataError objects, each corresponding to a file that failed validation. Each MetadataError object can include:
  - `fileName`: The name of the file that encountered validation errors, helping to identify the source of the issue.
  - `general`: An array of strings, with each string describing a specific validation error encountered in the file.

---

5. `validateSingleOnChainNFTMetadata ` - Targets the validation of metadata for a single NFT within a collection on the Hedera network. This method is particularly useful for in-depth analysis of individual NFTs.

```ts
type validateSingleOnChainNFTMetadataType = {
  network: string;
  tokenId: string;
  serialNumber: string;
  ipfsGateway?: string;
};

const singleNftValidationResult = await Hip412Validator.validateSingleOnChainNFTMetadata(network, tokenId, serialNumber, ipfsGateway);
```

- `network`: The network to use (mainnet, testnet or previewnet),
- `tokenId`: The unique identifier of the NFT token within the Hedera network, used to locate and validate metadata for the specific token,
- `serialNumber`: The serial number of the NFT, allowing for the validation of metadata for individual NFTs within a collection,
- `ipfsGateway`: Optional. Specifies the IPFS gateway URL to be used for decoding the encoded NFT metadata URL.

### Output

This method returns an object contains:

- `isValid` boolean flag
- Array of errors

---

6. `validateMetadataFromOnChainCollection` - Fetches and validates metadata for an entire NFT collection directly from the Hedera network, leveraging either the testnet or mainnet. This method is crucial for verifying the compliance of on-chain NFT collections.

```ts
type validateSingleOnChainNFTMetadataType = {
  network: string;
  tokenId: string;
  ipfsGateway?: string;
  limit: number;
};

const collectionValidationResult = await Hip412Validator.validateMetadataFromOnChainCollection(network, tokenId, ipfsGateway, limit);
```

- `network`: The network to use (mainnet, testnet or previewnet),
- `tokenId`: The unique identifier of the NFT token within the Hedera network, used to locate and validate metadata for the specific token,
- `ipfsGateway`: Optional. Specifies the IPFS gateway URL to be used for decoding the encoded NFT metadata URL,
- `limit`: Specifies how many NFT per page should be fetched. Default number is set to 100.

### Output

This method returns an object containing:

- `isValid`: A boolean flag indicating whether all metadata objects passed validation without any errors.
- `errors`: An array of objects, each containing a `serialNumber` identifying the specific NFT and a `message array` listing all validation errors found for that NFT.

<br>

## HIP 412 METADATA BUILDER

The Hip412MetadataBuilder class streamlines the creation of NFT metadata objects in alignment with the Hedera Improvement Proposal (HIP) 412 standards. It provides a fluent interface to incrementally build up a metadata object with validation at each step, ensuring that the resulting metadata conforms to the required specifications. This builder class is essential for developers seeking to craft compliant NFT metadata for deployment on the Hedera network.

### Methods & Initialization

Upon instantiation, the Hip412MetadataBuilder initializes a metadata object with `name`, `image` and `type` empty fields. Users can then sequentially apply various setters and adders to populate this metadata object with the necessary details.

## Initialization

```js
const metadataBuilder = new Hip412MetadataBuilder();
```

### Key Methods

```ts
- setName(name: string): 'Sets the name of the NFT',
- setImage(image: string): 'Sets the image URL for the NFT',
- setType(type: string): 'Sets the type of the NFT',
- setDescription(description: string): 'Adds a description to the NFT metadata',
- setCreator(creator: string): 'Defines the creator of the NFT',
- setCreatorDID(creatorDID: string): 'Specifies the Decentralized Identifier (DID) for the creator',
- setChecksum(checksum: string): 'Assigns a checksum for the metadata integrity verification',
- addAttribute(attribute: Attribute): 'Appends a custom attribute to the NFT. Can be used multiple times',
- addFile(file: FileMetadata): 'Adds a file (with URI, type, etc.) to the NFT metadata. Can be used multiple times',
- addProperty({ key, value }): 'Includes a custom property to the NFT metadata. Can be used multiple times',
- setLocalization(localization: Localization): 'Establishes localization information for the NFT metadata',
- build(): 'Validates and finalizes the metadata object, returning both the metadata and its validation result'.
```

### Usage

Here's an example of how to use the `Hip412MetadataBuilder` to construct NFT metadata:

```ts
const builder = new Hip412MetadataBuilder()
  .setName('My Awesome NFT')
  .setImage('https://example.com/my-awesome-nft.png')
  .setType('image/png')
  .setDescription('This is a description of my awesome NFT')
  .addAttribute({
    trait_type: 'Background',
    value: 'Space',
  })
  .addFile({
    uri: 'https://example.com/nft-metadata.json',
    type: 'application/json',
  })
  .build();

console.log(builder.metadata); // The constructed metadata object
console.log(builder.validationResponse); // The validation results
```

### Output

The `build` method returns an object containing:

- `metadata`: the constructed NFT metadata object ready for publication or further manipulation,
- `validationResponse`: an object including: `isValid` boolean flag and an `array of validation errors` if any issues were found with the metadata.

The Hip412MetadataBuilder class is designed to be flexible, allowing for the addition of more complex metadata structures such as localized descriptions, multiple files, and custom attributes, ensuring that developers can fully utilize the HIP-412 standard for their NFT projects.

---

## Questions or Improvement Proposals

Please create an issue or PR on [this repository](https://github.com/hashgraph/hedera-nft-utilities). Make sure to join the [Hedera Discord server](https://hedera.com/discord) to ask questions or discuss improvement suggestions.

# Support

If you have a question on how to use the product, please see our
[support guide](https://github.com/hashgraph/.github/blob/main/SUPPORT.md).

# Contributing

Contributions are welcome. Please see the
[contributing guide](https://github.com/hashgraph/.github/blob/main/CONTRIBUTING.md)
to see how you can get involved.

# Code of Conduct

This project is governed by the
[Contributor Covenant Code of Conduct](https://github.com/hashgraph/.github/blob/main/CODE_OF_CONDUCT.md). By
participating, you are expected to uphold this code of conduct. Please report unacceptable behavior
to [oss@hedera.com](mailto:oss@hedera.com).

# License

[Apache License 2.0](LICENSE)
