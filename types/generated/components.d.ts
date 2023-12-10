import type { Schema, Attribute } from '@strapi/strapi';

export interface ListsCharacterInventory extends Schema.Component {
  collectionName: 'components_lists_character_inventories';
  info: {
    displayName: 'CharacterInventory';
    icon: 'briefcase';
  };
  attributes: {
    inventory_item: Attribute.Component<'selection.inventory-item', true>;
  };
}

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

export interface SelectionInventoryItem extends Schema.Component {
  collectionName: 'components_selection_inventory_items';
  info: {
    displayName: 'InventoryItem';
  };
  attributes: {
    text: Attribute.String;
    item: Attribute.Relation<
      'selection.inventory-item',
      'oneToOne',
      'plugin::dimm-city.item'
    >;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'lists.character-inventory': ListsCharacterInventory;
      'lists.list100': ListsList100;
      'lists.lists': ListsLists;
      'selection.inventory-item': SelectionInventoryItem;
    }
  }
}
