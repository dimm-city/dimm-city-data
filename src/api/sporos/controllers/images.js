"use strict";

/**
 * A set of functions called "actions" for `images`
 */

module.exports = {
  image: async (ctx, next) => {
    try {
      const releaseKey = ctx.params.release;
      const id = ctx.params.id;
      const ext = "png";
      const service = strapi.service("api::sporos.images");
      const output = await service.getImage(releaseKey, id);

      if (ext == "png") ctx.response.set("Content-Type", "image/png");
      else if (ext == "mp4") ctx.response.set("content-type", "video/mp4");

      ctx.response.set("Content-Length", output.length);
      ctx.response.body = output;
      ctx.response.setEncoding = "binary";
      ctx.response.set("Cache-Control", "public, max-age=3600");
      ctx.response.set("Date", new Date());
    } catch (error) {
      //ctx.response.set("content-type", "text/html");
      if (error.message == "404" || error.statusCode == 404) {
        console.error("Token not found");
        ctx.body = "Token not found";
        ctx.response.status = 404;
      } else {
        console.log("err", error);
        ctx.body = "What the..!?";
        ctx.response.status = 500;
      }
    }
  },
  thumbnail: async (ctx, next) => {},
};
