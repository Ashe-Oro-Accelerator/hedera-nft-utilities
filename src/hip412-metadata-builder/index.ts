import { Hip412Validator } from '../hip412-validator';
import { Attribute, NFTMetadata } from '../types/nft-metadata';
import { FileValidationResult } from '../types/hip412-validator';
import { DisplayType } from '../types/nft-metadata';

interface Hip412MetadataBuilderInterface {
  metadata: NFTMetadata;
  validationResponse: FileValidationResult;
}

export class Hip412MetadataBuilder {
  private metadataObject: NFTMetadata;

  constructor() {
    this.metadataObject = {
      name: '',
      image: '',
      type: '',
      format: 'HIP412@2.0.0',
    };
  }

  private setProperty<T extends keyof NFTMetadata>(key: T, value: NFTMetadata[T]): Hip412MetadataBuilder {
    if (this.metadataObject[key]) {
      throw new Error(`${key} can only be set once.`);
    }
    this.metadataObject[key] = value;
    return this;
  }

  setName(name: string): Hip412MetadataBuilder {
    return this.setProperty('name', name);
  }

  setImage(image: string): Hip412MetadataBuilder {
    return this.setProperty('image', image);
  }

  setType(type: string): Hip412MetadataBuilder {
    return this.setProperty('type', type);
  }

  setCreator(creator: string): Hip412MetadataBuilder {
    return this.setProperty('creator', creator);
  }

  setCreatorDID(creatorDID: string): Hip412MetadataBuilder {
    return this.setProperty('creatorDID', creatorDID);
  }

  setDescription(description: string): Hip412MetadataBuilder {
    return this.setProperty('description', description);
  }

  setChecksum(checksum: string): Hip412MetadataBuilder {
    return this.setProperty('checksum', checksum);
  }

  addAttribute(trait_type: string, value: string, display_type?: DisplayType, max_value?: string | number): Hip412MetadataBuilder {
    const attribute: Attribute = { trait_type, value };

    if (!this.metadataObject.attributes) {
      this.metadataObject.attributes = [];
    }

    if (display_type !== undefined) {
      attribute.display_type = display_type;
    }
    if (max_value !== undefined) {
      attribute.max_value = max_value;
    }

    if (!this.metadataObject.attributes) {
      this.metadataObject.attributes = [];
    }
    this.metadataObject.attributes.push(attribute);
    return this;
  }

  build(): Hip412MetadataBuilderInterface {
    const validationResponse = Hip412Validator.validateSingleMetadataObject(this.metadataObject);
    return { validationResponse, metadata: this.metadataObject };
  }
}
