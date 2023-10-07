const { TYPE_CONTRACT, NAME_ENTITY_INIT } = require("../../consts");
const { formatMediaUrl } = require("../../shared/formatters");
module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    if (data?.contract?.id || data?.contract?.connect?.length > 0) {
      let contract = data.contract;
      if (contract == null) {
        const svc = strapi.service(TYPE_CONTRACT);
        contract = await svc.findOne(data.contract.connect[0]?.id);
      }

      if (contract?.slug && !data.slug?.startsWith(contract.slug)) {
        data.slug = `${contract.slug}-${data.tokenId}`;
      }

      data.metadata = data.metadata || {};

      if (contract.replaceMediaUrls === true) {
        data.metadata.thumbnail_uri = formatMediaUrl(
          data.contract.slug,
          data.tokenId,
          "_thumbnail"
        );
        data.metadata.image = formatMediaUrl(data.contract.slug, data.tokenId);
        data.metadata.full_resolution_uri = formatMediaUrl(
          data.contract.slug,
          data.tokenId
        );
      }
    }
  },
  async afterCreate(event) {
    const { result } = event;
    const { data } = event.params;

    if (data?.contract?.id || data?.contract?.connect?.length > 0) {
      const svc = strapi.service(TYPE_CONTRACT);

      let contract = data.contract;

      if (contract == null) {
        contract = await svc.findOne(data.contract.connect[0]?.id);
      }

      if (contract?.entityType && contract.autoPublishEntity) {
        const entity = await strapi.entityService.findMany(
          contract.entityType,
          {
            filters: {
              tokenId: result.slug,
            },
            publicationState: "preview",
          }
        );
        if (entity?.length === 0) {
          let newEntity = {
            data: {
              name: result.metadata?.name,
            },
          };
          //Do default init, parse properties of metadata and attempt to map them to entity properties

          if (contract.metadataService) {
            const metaSvc = strapi.services[contract.metadataService];

            if (metaSvc && metaSvc[NAME_ENTITY_INIT] instanceof Function)
              newEntity.data = await metaSvc[NAME_ENTITY_INIT](result);
          }

          newEntity.data.name = entity[0].name;
          
          newEntity.data.mainImage = data.mainImage;
          newEntity.data.mainVideo = data.mainVideo;
          newEntity.data.mainModel = data.mainModel;

          newEntity.data.token = result;
          newEntity.data.tokenId = result.slug;

          await strapi.entityService.create(contract.entityType, newEntity);
        } else if (entity?.length === 1) {
          const id = entity[0].id;

          let updatedEntity = {
            data: {
              token: result,
            },
          };

          if (contract.metadataService) {
            const metaSvc = strapi.services[contract.metadataService];

            if (metaSvc && metaSvc[NAME_ENTITY_INIT] instanceof Function)
              updatedEntity.data = await metaSvc[NAME_ENTITY_INIT](result);
          }

          updatedEntity.data.mainImage = data.mainImage;
          updatedEntity.data.mainVideo = data.mainVideo;
          updatedEntity.data.mainModel = data.mainModel;

          updatedEntity.data.token = result;
          updatedEntity.data.tokenId = result.slug;
          await strapi.entityService.update(
            contract.entityType,
            id,
            updatedEntity
          );
        }
      }
    }
  },
};
