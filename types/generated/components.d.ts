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

export interface SelectionCyberneticComponent extends Schema.Component {
  collectionName: 'components_selection_cybernetic_component';
  info: {
    displayName: 'Cybernetic Component';
  };
  attributes: {
    text: Attribute.String;
    description: Attribute.RichText &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    item: Attribute.Relation<
      'selection.cybernetic-component',
      'oneToOne',
      'plugin::dimm-city.cybernetic'
    >;
  };
}

export interface SelectionInventoryItem extends Schema.Component {
  collectionName: 'components_selection_inventory_items';
  info: {
    displayName: 'Inventory Item';
  };
  attributes: {
    text: Attribute.String;
    description: Attribute.RichText &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    item: Attribute.Relation<
      'selection.inventory-item',
      'oneToOne',
      'plugin::dimm-city.item'
    >;
  };
}

export interface SelectionScriptComponent extends Schema.Component {
  collectionName: 'components_selection_script_component';
  info: {
    displayName: 'Script Component';
  };
  attributes: {
    text: Attribute.String;
    description: Attribute.RichText &
      Attribute.SetMinMaxLength<{
        maxLength: 500;
      }>;
    item: Attribute.Relation<
      'selection.script-component',
      'oneToOne',
      'plugin::dimm-city.script'
    >;
  };
}

declare module '@strapi/types' {
  export module Shared {
    export interface Components {
      'lists.list100': ListsList100;
      'lists.lists': ListsLists;
      'selection.cybernetic-component': SelectionCyberneticComponent;
      'selection.inventory-item': SelectionInventoryItem;
      'selection.script-component': SelectionScriptComponent;
    }
  }
}
