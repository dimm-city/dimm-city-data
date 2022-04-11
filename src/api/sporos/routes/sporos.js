module.exports = {
  routes: [
    {
      method: "GET",
      path: "/metadata/:type/:release/:id",
      handler: "metadata.findOne",
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
      path: "/sporos/update/:tokenId",
      handler: "characters.update",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/images/sporos/:release/thumbnails/:id.png",
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
