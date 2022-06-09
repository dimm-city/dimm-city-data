module.exports = {
  routes: [
    {
      method: "GET",
      path: "/metadata/:type/:release/:id.json",
      handler: "metadata.findOne",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/sporos/can-edit/:release-:id",
      handler: "characters.canEdit",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/sporos/import/:release/:id",
      handler: "characters.import",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/sporos/update/:release-:id",
      handler: "characters.update",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/thumbnails/sporos/:release/:id.png",
      handler: "images.thumbnail",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/images/sporos/:release/:id.png",
      handler: "images.image",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
