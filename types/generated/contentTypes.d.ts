import type { Schema, Attribute } from '@strapi/strapi';

export interface AdminPermission extends Schema.CollectionType {
  collectionName: 'admin_permissions';
  info: {
    name: 'Permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    actionParameters: Attribute.JSON & Attribute.DefaultTo<{}>;
    subject: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    properties: Attribute.JSON & Attribute.DefaultTo<{}>;
    conditions: Attribute.JSON & Attribute.DefaultTo<[]>;
    role: Attribute.Relation<'admin::permission', 'manyToOne', 'admin::role'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminUser extends Schema.CollectionType {
  collectionName: 'admin_users';
  info: {
    name: 'User';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    firstname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastname: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    username: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.Private &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    registrationToken: Attribute.String & Attribute.Private;
    isActive: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    roles: Attribute.Relation<'admin::user', 'manyToMany', 'admin::role'> &
      Attribute.Private;
    blocked: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<false>;
    preferedLanguage: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::user', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminRole extends Schema.CollectionType {
  collectionName: 'admin_roles';
  info: {
    name: 'Role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    code: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String;
    users: Attribute.Relation<'admin::role', 'manyToMany', 'admin::user'>;
    permissions: Attribute.Relation<
      'admin::role',
      'oneToMany',
      'admin::permission'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
    updatedBy: Attribute.Relation<'admin::role', 'oneToOne', 'admin::user'> &
      Attribute.Private;
  };
}

export interface AdminApiToken extends Schema.CollectionType {
  collectionName: 'strapi_api_tokens';
  info: {
    name: 'Api Token';
    singularName: 'api-token';
    pluralName: 'api-tokens';
    displayName: 'Api Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    type: Attribute.Enumeration<['read-only', 'full-access', 'custom']> &
      Attribute.Required &
      Attribute.DefaultTo<'read-only'>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::api-token',
      'oneToMany',
      'admin::api-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminApiTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_api_token_permissions';
  info: {
    name: 'API Token Permission';
    description: '';
    singularName: 'api-token-permission';
    pluralName: 'api-token-permissions';
    displayName: 'API Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::api-token-permission',
      'manyToOne',
      'admin::api-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::api-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferToken extends Schema.CollectionType {
  collectionName: 'strapi_transfer_tokens';
  info: {
    name: 'Transfer Token';
    singularName: 'transfer-token';
    pluralName: 'transfer-tokens';
    displayName: 'Transfer Token';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }> &
      Attribute.DefaultTo<''>;
    accessKey: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    lastUsedAt: Attribute.DateTime;
    permissions: Attribute.Relation<
      'admin::transfer-token',
      'oneToMany',
      'admin::transfer-token-permission'
    >;
    expiresAt: Attribute.DateTime;
    lifespan: Attribute.BigInteger;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface AdminTransferTokenPermission extends Schema.CollectionType {
  collectionName: 'strapi_transfer_token_permissions';
  info: {
    name: 'Transfer Token Permission';
    description: '';
    singularName: 'transfer-token-permission';
    pluralName: 'transfer-token-permissions';
    displayName: 'Transfer Token Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 1;
      }>;
    token: Attribute.Relation<
      'admin::transfer-token-permission',
      'manyToOne',
      'admin::transfer-token'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'admin::transfer-token-permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFile extends Schema.CollectionType {
  collectionName: 'files';
  info: {
    singularName: 'file';
    pluralName: 'files';
    displayName: 'File';
    description: '';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    alternativeText: Attribute.String;
    caption: Attribute.String;
    width: Attribute.Integer;
    height: Attribute.Integer;
    formats: Attribute.JSON;
    hash: Attribute.String & Attribute.Required;
    ext: Attribute.String;
    mime: Attribute.String & Attribute.Required;
    size: Attribute.Decimal & Attribute.Required;
    url: Attribute.String & Attribute.Required;
    previewUrl: Attribute.String;
    provider: Attribute.String & Attribute.Required;
    provider_metadata: Attribute.JSON;
    related: Attribute.Relation<'plugin::upload.file', 'morphToMany'>;
    folder: Attribute.Relation<
      'plugin::upload.file',
      'manyToOne',
      'plugin::upload.folder'
    > &
      Attribute.Private;
    folderPath: Attribute.String &
      Attribute.Required &
      Attribute.Private &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.file',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUploadFolder extends Schema.CollectionType {
  collectionName: 'upload_folders';
  info: {
    singularName: 'folder';
    pluralName: 'folders';
    displayName: 'Folder';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    pathId: Attribute.Integer & Attribute.Required & Attribute.Unique;
    parent: Attribute.Relation<
      'plugin::upload.folder',
      'manyToOne',
      'plugin::upload.folder'
    >;
    children: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.folder'
    >;
    files: Attribute.Relation<
      'plugin::upload.folder',
      'oneToMany',
      'plugin::upload.file'
    >;
    path: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 1;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::upload.folder',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginChainWalletsChainToken extends Schema.CollectionType {
  collectionName: 'cw_tokens';
  info: {
    singularName: 'chain-token';
    pluralName: 'chain-tokens';
    displayName: 'Chain Token';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    tokenId: Attribute.String & Attribute.Required;
    slug: Attribute.UID & Attribute.Required;
    mainImage: Attribute.Media;
    mainVideo: Attribute.Media;
    mainModel: Attribute.Media;
    metadata: Attribute.JSON;
    contract: Attribute.Relation<
      'plugin::chain-wallets.chain-token',
      'manyToOne',
      'plugin::chain-wallets.chain-contract'
    >;
    wallet: Attribute.Relation<
      'plugin::chain-wallets.chain-token',
      'manyToOne',
      'plugin::chain-wallets.chain-wallet'
    >;
    character: Attribute.Relation<
      'plugin::chain-wallets.chain-token',
      'oneToOne',
      'plugin::dimm-city.character'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::chain-wallets.chain-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::chain-wallets.chain-token',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginChainWalletsChainContract extends Schema.CollectionType {
  collectionName: 'cw_contracts';
  info: {
    singularName: 'chain-contract';
    pluralName: 'chain-contracts';
    displayName: 'Chain Contract';
    description: '';
  };
  options: {
    draftAndPublish: true;
    privateAttributes: [
      'createdAt',
      'updatedAt',
      'createdBy',
      'updatedBy',
      'entityType',
      'metadataExtender',
      'entityInitializer'
    ];
  };
  pluginOptions: {
    i18n: {
      localized: false;
    };
    'content-manager': {
      visible: true;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    slug: Attribute.UID &
      Attribute.Required &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    description: Attribute.RichText &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    address: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    chain: Attribute.Enumeration<
      [
        'homestead',
        'goerli',
        'sepolia',
        'arbitrum',
        'arbitrum-goerli',
        'avalanche-mainnet',
        'avalanche-fuji',
        'matic',
        'maticmum',
        'optimism',
        'optimism-goerli'
      ]
    > &
      Attribute.Required &
      Attribute.DefaultTo<'homestead'>;
    tokens: Attribute.Relation<
      'plugin::chain-wallets.chain-contract',
      'oneToMany',
      'plugin::chain-wallets.chain-token'
    >;
    metadata: Attribute.JSON &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    abi: Attribute.JSON &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    totalSupply: Attribute.Integer &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    maxSupply: Attribute.Integer &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    price: Attribute.Decimal &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    imageUrl: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    videoUrl: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    thumbnailUrl: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    tags: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    authors: Attribute.Relation<
      'plugin::chain-wallets.chain-contract',
      'oneToMany',
      'plugin::chain-wallets.chain-wallet'
    >;
    admin: Attribute.Relation<
      'plugin::chain-wallets.chain-contract',
      'oneToOne',
      'plugin::chain-wallets.chain-wallet'
    >;
    metadataBaseUri: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: true;
        };
      }>;
    lastSynced: Attribute.Integer &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    enableSync: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    replaceMediaUrls: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<false>;
    autoPublishEntity: Attribute.Boolean &
      Attribute.Private &
      Attribute.DefaultTo<true>;
    entityType: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    metadataService: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    contractService: Attribute.String &
      Attribute.SetPluginOptions<{
        i18n: {
          localized: false;
        };
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::chain-wallets.chain-contract',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::chain-wallets.chain-contract',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginChainWalletsChainWallet extends Schema.CollectionType {
  collectionName: 'cw_wallets';
  info: {
    singularName: 'chain-wallet';
    pluralName: 'chain-wallets';
    displayName: 'Chain Wallet';
    description: '';
  };
  options: {
    draftAndPublish: false;
    privateAttributes: [
      'seed',
      'managed',
      'key',
      'encKey',
      'publishedAt',
      'createdAt',
      'updatedAt',
      'publishedBy',
      'createdBy',
      'updatedBy'
    ];
  };
  attributes: {
    address: Attribute.String & Attribute.Required;
    chain: Attribute.Enumeration<
      [
        'homestead',
        'goerli',
        'sepolia',
        'arbitrum',
        'arbitrum-goerli',
        'avalanche-mainnet',
        'avalanche-fuji',
        'matic',
        'maticmum',
        'optimism',
        'optimism-goerli'
      ]
    > &
      Attribute.Required &
      Attribute.DefaultTo<'homestead'>;
    name: Attribute.String;
    seed: Attribute.Text & Attribute.Private;
    managed: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<true>;
    primary: Attribute.Boolean & Attribute.Private & Attribute.DefaultTo<true>;
    key: Attribute.String & Attribute.Private;
    encKey: Attribute.Password;
    tokens: Attribute.Relation<
      'plugin::chain-wallets.chain-wallet',
      'oneToMany',
      'plugin::chain-wallets.chain-token'
    >;
    user: Attribute.Relation<
      'plugin::chain-wallets.chain-wallet',
      'manyToOne',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::chain-wallets.chain-wallet',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::chain-wallets.chain-wallet',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginDimmCityAbility extends Schema.CollectionType {
  collectionName: 'dc_abilities';
  info: {
    singularName: 'ability';
    pluralName: 'abilities';
    displayName: 'Abilities';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    slug: Attribute.UID<'plugin::dimm-city.ability', 'name'> &
      Attribute.Required;
    ap: Attribute.Integer & Attribute.DefaultTo<0>;
    maxAP: Attribute.Integer &
      Attribute.SetMinMax<{
        max: 100;
      }> &
      Attribute.DefaultTo<0>;
    rollDice: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    skillTrees: Attribute.Relation<
      'plugin::dimm-city.ability',
      'manyToMany',
      'plugin::dimm-city.skill-tree'
    >;
    cybernetic: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    external: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<true>;
    mainImage: Attribute.Media;
    description: Attribute.RichText;
    shortDescription: Attribute.Text;
    children: Attribute.Relation<
      'plugin::dimm-city.ability',
      'manyToMany',
      'plugin::dimm-city.ability'
    >;
    parents: Attribute.Relation<
      'plugin::dimm-city.ability',
      'manyToMany',
      'plugin::dimm-city.ability'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::dimm-city.ability',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::dimm-city.ability',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginDimmCityCharacter extends Schema.CollectionType {
  collectionName: 'dc_characters';
  info: {
    singularName: 'character';
    pluralName: 'characters';
    displayName: 'Characters';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    tokenId: Attribute.UID;
    hp: Attribute.Integer &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    ap: Attribute.Integer &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    race: Attribute.Relation<
      'plugin::dimm-city.character',
      'oneToOne',
      'plugin::dimm-city.race'
    >;
    height: Attribute.Decimal &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    weight: Attribute.Decimal &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    age: Attribute.Enumeration<
      [
        'Childhood',
        'Adolescence',
        'Young Adulthood',
        'Adulthood',
        'Middle-Age',
        'Old Age',
        'Ancient'
      ]
    > &
      Attribute.DefaultTo<'Young Adulthood'>;
    pronouns: Attribute.String;
    eyes: Attribute.String;
    skin: Attribute.String;
    hair: Attribute.String;
    vibe: Attribute.Text;
    noticeableTraits: Attribute.String;
    originLocation: Attribute.Relation<
      'plugin::dimm-city.character',
      'oneToOne',
      'plugin::dimm-city.location'
    >;
    currentLocation: Attribute.Relation<
      'plugin::dimm-city.character',
      'oneToOne',
      'plugin::dimm-city.location'
    >;
    faction: Attribute.Relation<
      'plugin::dimm-city.character',
      'manyToOne',
      'plugin::dimm-city.faction'
    >;
    backstory: Attribute.RichText;
    beliefs: Attribute.String;
    flaws: Attribute.String;
    dreams: Attribute.Text;
    clothing: Attribute.String;
    playerNotes: Attribute.RichText;
    movementDescription: Attribute.String;
    specialties: Attribute.Relation<
      'plugin::dimm-city.character',
      'manyToMany',
      'plugin::dimm-city.specialty'
    >;
    selectedAbilities: Attribute.Relation<
      'plugin::dimm-city.character',
      'oneToMany',
      'plugin::dimm-city.ability'
    >;
    selectedSkillTrees: Attribute.Relation<
      'plugin::dimm-city.character',
      'oneToMany',
      'plugin::dimm-city.skill-tree'
    >;
    cybernetics: Attribute.Relation<
      'plugin::dimm-city.character',
      'oneToMany',
      'plugin::dimm-city.ability'
    >;
    items: Attribute.Relation<
      'plugin::dimm-city.character',
      'oneToMany',
      'plugin::dimm-city.item'
    >;
    imageUrl: Attribute.String;
    mainImage: Attribute.Media;
    mainVideo: Attribute.Media;
    mainModel: Attribute.Media;
    historicalEvents: Attribute.Relation<
      'plugin::dimm-city.character',
      'manyToMany',
      'plugin::dimm-city.historical-event'
    >;
    token: Attribute.Relation<
      'plugin::dimm-city.character',
      'oneToOne',
      'plugin::chain-wallets.chain-token'
    >;
    playerUpdated: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    playerCharacter: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::dimm-city.character',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::dimm-city.character',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginDimmCityCharacterRelease extends Schema.CollectionType {
  collectionName: 'dc_character_releases';
  info: {
    singularName: 'character-release';
    pluralName: 'character-releases';
    displayName: 'Character Releases';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    slug: Attribute.UID & Attribute.Required;
    icon: Attribute.String;
    description: Attribute.RichText;
    mainImage: Attribute.Media;
    mainVideo: Attribute.Media;
    metadata: Attribute.JSON;
    races: Attribute.Relation<
      'plugin::dimm-city.character-release',
      'manyToMany',
      'plugin::dimm-city.race'
    >;
    contract: Attribute.Relation<
      'plugin::dimm-city.character-release',
      'oneToOne',
      'plugin::chain-wallets.chain-contract'
    >;
    tags: Attribute.String;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::dimm-city.character-release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::dimm-city.character-release',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginDimmCityFaction extends Schema.CollectionType {
  collectionName: 'dc_factions';
  info: {
    singularName: 'faction';
    pluralName: 'factions';
    displayName: 'Factions';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    slug: Attribute.UID<'plugin::dimm-city.faction', 'name'> &
      Attribute.Required;
    shortDescription: Attribute.Text;
    description: Attribute.RichText;
    mainImage: Attribute.Media;
    mainVideo: Attribute.Media;
    members: Attribute.Relation<
      'plugin::dimm-city.faction',
      'oneToMany',
      'plugin::dimm-city.character'
    >;
    leaders: Attribute.Relation<
      'plugin::dimm-city.faction',
      'oneToMany',
      'plugin::dimm-city.character'
    >;
    location: Attribute.Relation<
      'plugin::dimm-city.faction',
      'manyToOne',
      'plugin::dimm-city.location'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::dimm-city.faction',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::dimm-city.faction',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginDimmCityHistoricalEvent extends Schema.CollectionType {
  collectionName: 'dc_historical_events';
  info: {
    singularName: 'historical-event';
    pluralName: 'historical-events';
    displayName: 'Historical Events';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    slug: Attribute.UID<'plugin::dimm-city.historical-event', 'name'> &
      Attribute.Required;
    date: Attribute.Date;
    shortDescription: Attribute.Text & Attribute.Required;
    description: Attribute.RichText & Attribute.Required;
    mainImage: Attribute.Media;
    mainVideo: Attribute.Media;
    location: Attribute.Relation<
      'plugin::dimm-city.historical-event',
      'manyToOne',
      'plugin::dimm-city.location'
    >;
    characters: Attribute.Relation<
      'plugin::dimm-city.historical-event',
      'manyToMany',
      'plugin::dimm-city.character'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::dimm-city.historical-event',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::dimm-city.historical-event',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginDimmCityGalleryItem extends Schema.CollectionType {
  collectionName: 'dc_gallery_items';
  info: {
    singularName: 'gallery-item';
    pluralName: 'gallery-items';
    displayName: 'Gallery Items';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    caption: Attribute.RichText &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    height: Attribute.String;
    width: Attribute.String;
    mainVideo: Attribute.Media;
    mainImage: Attribute.Media;
    slug: Attribute.UID<'plugin::dimm-city.gallery-item', 'name'> &
      Attribute.Required;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::dimm-city.gallery-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::dimm-city.gallery-item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginDimmCityItem extends Schema.CollectionType {
  collectionName: 'dc_items';
  info: {
    singularName: 'item';
    pluralName: 'items';
    displayName: 'Items';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        maxLength: 100;
      }>;
    slug: Attribute.UID<'plugin::dimm-city.item', 'name'>;
    tags: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 3;
        maxLength: 250;
      }>;
    type: Attribute.Enumeration<
      ['weapon', 'armor', 'cybernetics', 'tools', 'clothing', 'misc']
    > &
      Attribute.Required &
      Attribute.DefaultTo<'misc'>;
    mainImage: Attribute.Media;
    mainVideo: Attribute.Media;
    mainModel: Attribute.Media;
    shortDescription: Attribute.String;
    description: Attribute.RichText &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::dimm-city.item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::dimm-city.item',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginDimmCityJournalEntry extends Schema.CollectionType {
  collectionName: 'dc_journal_entries';
  info: {
    singularName: 'journal-entry';
    pluralName: 'journal-entries';
    displayName: 'Journal Entries';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String;
    slug: Attribute.UID<'plugin::dimm-city.journal-entry', 'name'>;
    type: Attribute.Enumeration<['text', 'content', 'media']> &
      Attribute.Required &
      Attribute.DefaultTo<'text'>;
    recordedAt: Attribute.DateTime &
      Attribute.DefaultTo<'2022-10-31T05:00:00.000Z'>;
    shortDescription: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    description: Attribute.RichText &
      Attribute.SetMinMaxLength<{
        maxLength: 5000;
      }>;
    mainImage: Attribute.Media;
    mainVideo: Attribute.Media;
    mainModel: Attribute.Media;
    mainAudio: Attribute.Media;
    tags: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 3;
        maxLength: 250;
      }>;
    metadata: Attribute.JSON;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::dimm-city.journal-entry',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::dimm-city.journal-entry',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginDimmCityLocation extends Schema.CollectionType {
  collectionName: 'dc_locations';
  info: {
    singularName: 'location';
    pluralName: 'locations';
    displayName: 'Locations';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    slug: Attribute.UID<'plugin::dimm-city.location', 'name'>;
    tags: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 3;
        maxLength: 250;
      }>;
    shortDescription: Attribute.Text;
    description: Attribute.RichText;
    races: Attribute.Relation<
      'plugin::dimm-city.location',
      'manyToMany',
      'plugin::dimm-city.race'
    >;
    regions: Attribute.Relation<
      'plugin::dimm-city.location',
      'oneToMany',
      'plugin::dimm-city.location'
    >;
    region: Attribute.Relation<
      'plugin::dimm-city.location',
      'manyToOne',
      'plugin::dimm-city.location'
    >;
    world: Attribute.Relation<
      'plugin::dimm-city.location',
      'manyToOne',
      'plugin::dimm-city.world'
    >;
    factions: Attribute.Relation<
      'plugin::dimm-city.location',
      'oneToMany',
      'plugin::dimm-city.faction'
    >;
    historicalEvents: Attribute.Relation<
      'plugin::dimm-city.location',
      'oneToMany',
      'plugin::dimm-city.historical-event'
    >;
    mainImage: Attribute.Media;
    mainVideo: Attribute.Media;
    mainModel: Attribute.Media;
    mainAudio: Attribute.Media;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::dimm-city.location',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::dimm-city.location',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginDimmCityPayment extends Schema.CollectionType {
  collectionName: 'dc_payments';
  info: {
    singularName: 'payment';
    pluralName: 'payments';
    displayName: 'Payments';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    paymentId: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 1;
        maxLength: 500;
      }>;
    token: Attribute.Relation<
      'plugin::dimm-city.payment',
      'oneToOne',
      'plugin::chain-wallets.chain-token'
    >;
    user: Attribute.Relation<
      'plugin::dimm-city.payment',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    success: Attribute.Boolean &
      Attribute.Required &
      Attribute.DefaultTo<false>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::dimm-city.payment',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::dimm-city.payment',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginDimmCityPage extends Schema.CollectionType {
  collectionName: 'dc_pages';
  info: {
    singularName: 'page';
    pluralName: 'pages';
    displayName: 'Pages';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    title: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 2;
        maxLength: 500;
      }>;
    content: Attribute.RichText;
    styles: Attribute.Text;
    tags: Attribute.String;
    description: Attribute.Text;
    mainImage: Attribute.Media;
    mainVideo: Attribute.Media;
    mainModel: Attribute.Media;
    mainAudio: Attribute.Media;
    public: Attribute.Boolean & Attribute.Required & Attribute.DefaultTo<true>;
    slug: Attribute.UID<'plugin::dimm-city.page', 'title'> & Attribute.Required;
    author: Attribute.String;
    downloads: Attribute.Media;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::dimm-city.page',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::dimm-city.page',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginDimmCityProfile extends Schema.CollectionType {
  collectionName: 'dc_profiles';
  info: {
    singularName: 'profile';
    pluralName: 'profiles';
    displayName: 'Profile';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    displayName: Attribute.String;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    bio: Attribute.RichText;
    notifications: Attribute.Boolean & Attribute.DefaultTo<true>;
    user: Attribute.Relation<
      'plugin::dimm-city.profile',
      'oneToOne',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::dimm-city.profile',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::dimm-city.profile',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginDimmCityRace extends Schema.CollectionType {
  collectionName: 'dc_races';
  info: {
    singularName: 'race';
    pluralName: 'races';
    displayName: 'Races';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    slug: Attribute.UID<'plugin::dimm-city.race', 'name'>;
    tags: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 3;
        maxLength: 250;
      }>;
    playable: Attribute.Boolean;
    hp: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<{
        max: 20;
      }>;
    atk: Attribute.Integer &
      Attribute.Required &
      Attribute.SetMinMax<{
        min: 0;
      }>;
    shortDescription: Attribute.Text;
    occupations: Attribute.Text;
    appearance: Attribute.Text & Attribute.Required;
    ideals: Attribute.Text;
    flaws: Attribute.Text;
    desires: Attribute.Text;
    problems: Attribute.Text;
    description: Attribute.RichText;
    abilities: Attribute.Relation<
      'plugin::dimm-city.race',
      'oneToMany',
      'plugin::dimm-city.ability'
    >;
    characterReleases: Attribute.Relation<
      'plugin::dimm-city.race',
      'manyToMany',
      'plugin::dimm-city.character-release'
    >;
    allies: Attribute.Relation<
      'plugin::dimm-city.race',
      'oneToMany',
      'plugin::dimm-city.race'
    >;
    enemies: Attribute.Relation<
      'plugin::dimm-city.race',
      'oneToMany',
      'plugin::dimm-city.race'
    >;
    locations: Attribute.Relation<
      'plugin::dimm-city.race',
      'manyToMany',
      'plugin::dimm-city.location'
    >;
    mainImage: Attribute.Media;
    mainVideo: Attribute.Media;
    mainModel: Attribute.Media;
    additionalImages: Attribute.Media;
    size: Attribute.Enumeration<
      ['Tiny', 'Small', 'Medium', 'Big', 'Huge', 'Colossal']
    > &
      Attribute.DefaultTo<'Medium'>;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::dimm-city.race',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::dimm-city.race',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginDimmCitySkillTree extends Schema.CollectionType {
  collectionName: 'dc_skill_trees';
  info: {
    singularName: 'skill-tree';
    pluralName: 'skill-trees';
    displayName: 'Skill Trees';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    slug: Attribute.UID<'plugin::dimm-city.skill-tree', 'name'>;
    specialty: Attribute.Relation<
      'plugin::dimm-city.skill-tree',
      'manyToOne',
      'plugin::dimm-city.specialty'
    >;
    shortDescription: Attribute.Text;
    description: Attribute.RichText & Attribute.Required;
    mainImage: Attribute.Media;
    mainVideo: Attribute.Media;
    abilities: Attribute.Relation<
      'plugin::dimm-city.skill-tree',
      'manyToMany',
      'plugin::dimm-city.ability'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::dimm-city.skill-tree',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::dimm-city.skill-tree',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginDimmCitySpecialty extends Schema.CollectionType {
  collectionName: 'dc_specialties';
  info: {
    singularName: 'specialty';
    pluralName: 'specialties';
    displayName: 'Specialties';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String & Attribute.Required;
    slug: Attribute.UID<'plugin::dimm-city.specialty', 'name'>;
    tags: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 3;
        maxLength: 250;
      }>;
    shortDescription: Attribute.String;
    description: Attribute.RichText;
    skillTrees: Attribute.Relation<
      'plugin::dimm-city.specialty',
      'oneToMany',
      'plugin::dimm-city.skill-tree'
    >;
    mainImage: Attribute.Media;
    mainVideo: Attribute.Media;
    mainModel: Attribute.Media;
    mainAudio: Attribute.Media;
    characters: Attribute.Relation<
      'plugin::dimm-city.specialty',
      'manyToMany',
      'plugin::dimm-city.character'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::dimm-city.specialty',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::dimm-city.specialty',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginDimmCitySpore extends Schema.CollectionType {
  collectionName: 'dc_spores';
  info: {
    singularName: 'spore';
    pluralName: 'spores';
    displayName: 'Spores';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    slug: Attribute.UID<'plugin::dimm-city.spore', 'name'> & Attribute.Required;
    tags: Attribute.String &
      Attribute.SetMinMaxLength<{
        minLength: 3;
        maxLength: 250;
      }>;
    subtitle: Attribute.String;
    description: Attribute.String &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    shortDescription: Attribute.Text &
      Attribute.SetMinMaxLength<{
        maxLength: 150;
      }>;
    introduction: Attribute.RichText;
    customCss: Attribute.RichText;
    villains: Attribute.Component<'lists.lists', true>;
    plots: Attribute.Component<'lists.lists', true>;
    goals: Attribute.Component<'lists.lists', true>;
    twists: Attribute.Component<'lists.list100', true>;
    mainImage: Attribute.Media;
    mainVideo: Attribute.Media;
    mainAudio: Attribute.Media;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::dimm-city.spore',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::dimm-city.spore',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginDimmCityStory extends Schema.CollectionType {
  collectionName: 'dc_stories';
  info: {
    singularName: 'story';
    pluralName: 'stories';
    displayName: 'Stories';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    slug: Attribute.UID<'plugin::dimm-city.story', 'name'> & Attribute.Required;
    shortDescription: Attribute.Text & Attribute.Required;
    mainImage: Attribute.Media;
    html: Attribute.Media;
    media: Attribute.Media;
    characters: Attribute.Relation<
      'plugin::dimm-city.story',
      'oneToMany',
      'plugin::dimm-city.character'
    >;
    locations: Attribute.Relation<
      'plugin::dimm-city.story',
      'oneToMany',
      'plugin::dimm-city.location'
    >;
    factions: Attribute.Relation<
      'plugin::dimm-city.story',
      'oneToMany',
      'plugin::dimm-city.faction'
    >;
    historicalEvents: Attribute.Relation<
      'plugin::dimm-city.story',
      'oneToMany',
      'plugin::dimm-city.historical-event'
    >;
    races: Attribute.Relation<
      'plugin::dimm-city.story',
      'oneToMany',
      'plugin::dimm-city.race'
    >;
    system: Attribute.Enumeration<['SugarCube2', 'WAA', 'Quest', 'Ink']>;
    configuration: Attribute.JSON;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::dimm-city.story',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::dimm-city.story',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginDimmCityTerm extends Schema.CollectionType {
  collectionName: 'dc_terms';
  info: {
    singularName: 'term';
    pluralName: 'terms';
    displayName: 'Terms';
  };
  options: {
    draftAndPublish: true;
    comment: '';
  };
  attributes: {
    slug: Attribute.UID<'plugin::dimm-city.term', 'word'> & Attribute.Required;
    word: Attribute.String;
    definition: Attribute.RichText;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::dimm-city.term',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::dimm-city.term',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginDimmCityWorld extends Schema.CollectionType {
  collectionName: 'dc_worlds';
  info: {
    singularName: 'world';
    pluralName: 'worlds';
    displayName: 'Worlds';
    description: '';
  };
  options: {
    draftAndPublish: true;
  };
  attributes: {
    name: Attribute.String & Attribute.Required & Attribute.Unique;
    slug: Attribute.UID<'plugin::dimm-city.world', 'name'> & Attribute.Required;
    description: Attribute.RichText;
    mainImage: Attribute.Media;
    mainVideo: Attribute.Media;
    mainModel: Attribute.Media;
    mainAudio: Attribute.Media;
    locations: Attribute.Relation<
      'plugin::dimm-city.world',
      'oneToMany',
      'plugin::dimm-city.location'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    publishedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::dimm-city.world',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::dimm-city.world',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsPermission
  extends Schema.CollectionType {
  collectionName: 'up_permissions';
  info: {
    name: 'permission';
    description: '';
    singularName: 'permission';
    pluralName: 'permissions';
    displayName: 'Permission';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    action: Attribute.String & Attribute.Required;
    role: Attribute.Relation<
      'plugin::users-permissions.permission',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.permission',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsRole extends Schema.CollectionType {
  collectionName: 'up_roles';
  info: {
    name: 'role';
    description: '';
    singularName: 'role';
    pluralName: 'roles';
    displayName: 'Role';
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    description: Attribute.String;
    type: Attribute.String & Attribute.Unique;
    permissions: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.permission'
    >;
    users: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToMany',
      'plugin::users-permissions.user'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.role',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginUsersPermissionsUser extends Schema.CollectionType {
  collectionName: 'up_users';
  info: {
    name: 'user';
    description: '';
    singularName: 'user';
    pluralName: 'users';
    displayName: 'User';
  };
  options: {
    draftAndPublish: false;
  };
  attributes: {
    username: Attribute.String &
      Attribute.Required &
      Attribute.Unique &
      Attribute.SetMinMaxLength<{
        minLength: 3;
      }>;
    email: Attribute.Email &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    provider: Attribute.String;
    password: Attribute.Password &
      Attribute.Private &
      Attribute.SetMinMaxLength<{
        minLength: 6;
      }>;
    resetPasswordToken: Attribute.String & Attribute.Private;
    confirmationToken: Attribute.String & Attribute.Private;
    confirmed: Attribute.Boolean & Attribute.DefaultTo<false>;
    blocked: Attribute.Boolean & Attribute.DefaultTo<false>;
    role: Attribute.Relation<
      'plugin::users-permissions.user',
      'manyToOne',
      'plugin::users-permissions.role'
    >;
    wallets: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToMany',
      'plugin::chain-wallets.chain-wallet'
    >;
    profile: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'plugin::dimm-city.profile'
    >;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::users-permissions.user',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

export interface PluginI18NLocale extends Schema.CollectionType {
  collectionName: 'i18n_locale';
  info: {
    singularName: 'locale';
    pluralName: 'locales';
    collectionName: 'locales';
    displayName: 'Locale';
    description: '';
  };
  options: {
    draftAndPublish: false;
  };
  pluginOptions: {
    'content-manager': {
      visible: false;
    };
    'content-type-builder': {
      visible: false;
    };
  };
  attributes: {
    name: Attribute.String &
      Attribute.SetMinMax<{
        min: 1;
        max: 50;
      }>;
    code: Attribute.String & Attribute.Unique;
    createdAt: Attribute.DateTime;
    updatedAt: Attribute.DateTime;
    createdBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
    updatedBy: Attribute.Relation<
      'plugin::i18n.locale',
      'oneToOne',
      'admin::user'
    > &
      Attribute.Private;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface ContentTypes {
      'admin::permission': AdminPermission;
      'admin::user': AdminUser;
      'admin::role': AdminRole;
      'admin::api-token': AdminApiToken;
      'admin::api-token-permission': AdminApiTokenPermission;
      'admin::transfer-token': AdminTransferToken;
      'admin::transfer-token-permission': AdminTransferTokenPermission;
      'plugin::upload.file': PluginUploadFile;
      'plugin::upload.folder': PluginUploadFolder;
      'plugin::chain-wallets.chain-token': PluginChainWalletsChainToken;
      'plugin::chain-wallets.chain-contract': PluginChainWalletsChainContract;
      'plugin::chain-wallets.chain-wallet': PluginChainWalletsChainWallet;
      'plugin::dimm-city.ability': PluginDimmCityAbility;
      'plugin::dimm-city.character': PluginDimmCityCharacter;
      'plugin::dimm-city.character-release': PluginDimmCityCharacterRelease;
      'plugin::dimm-city.faction': PluginDimmCityFaction;
      'plugin::dimm-city.historical-event': PluginDimmCityHistoricalEvent;
      'plugin::dimm-city.gallery-item': PluginDimmCityGalleryItem;
      'plugin::dimm-city.item': PluginDimmCityItem;
      'plugin::dimm-city.journal-entry': PluginDimmCityJournalEntry;
      'plugin::dimm-city.location': PluginDimmCityLocation;
      'plugin::dimm-city.payment': PluginDimmCityPayment;
      'plugin::dimm-city.page': PluginDimmCityPage;
      'plugin::dimm-city.profile': PluginDimmCityProfile;
      'plugin::dimm-city.race': PluginDimmCityRace;
      'plugin::dimm-city.skill-tree': PluginDimmCitySkillTree;
      'plugin::dimm-city.specialty': PluginDimmCitySpecialty;
      'plugin::dimm-city.spore': PluginDimmCitySpore;
      'plugin::dimm-city.story': PluginDimmCityStory;
      'plugin::dimm-city.term': PluginDimmCityTerm;
      'plugin::dimm-city.world': PluginDimmCityWorld;
      'plugin::users-permissions.permission': PluginUsersPermissionsPermission;
      'plugin::users-permissions.role': PluginUsersPermissionsRole;
      'plugin::users-permissions.user': PluginUsersPermissionsUser;
      'plugin::i18n.locale': PluginI18NLocale;
    }
  }
}
