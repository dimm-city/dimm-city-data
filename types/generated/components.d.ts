import type { Schema, Attribute } from '@strapi/strapi';

export interface ListsList100 extends Schema.Component {
  collectionName: 'components_lists_list100s';
  info: {
    displayName: 'List100';
    icon: 'align-justify';
    description: '';
  };
  attributes: {
    value: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 1000;
      }>;
  };
}

export interface ListsLists extends Schema.Component {
  collectionName: 'components_lists_lists';
  info: {
    displayName: 'Lists';
    icon: 'align-justify';
  };
  attributes: {
    value: Attribute.String &
      Attribute.Required &
      Attribute.SetMinMaxLength<{
        maxLength: 50;
      }>;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'lists.list100': ListsList100;
      'lists.lists': ListsLists;
    }
  }
}
