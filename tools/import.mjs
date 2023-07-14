import http from "http";
import { readdir, readFile } from "fs/promises";
import path from "path";

const your_api_key =
  process.argv[2] ??
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTIsImlhdCI6MTY4OTMwOTg1NCwiZXhwIjoxNjkxOTAxODU0fQ.wg1rIOCq9_ttzUjcvscOpEjG-RCW07qEBbVvVOaPrpo";
const directoryPath = path.join("../../extract-output");

const postEntity = (entity, contentType) => {
  const recordData = { data: { ...entity.attributes } };
  const data = JSON.stringify(recordData);

  const options = {
    hostname: "localhost",
    port: 1337,
    path: `/api/dimm-city/${contentType}`,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // If needed, include your Strapi API key below
      Authorization: `Bearer ${your_api_key}`,
    },
  };

  const req = http.request(options, (res) => {
    console.log(`statusCode: ${res.statusCode}`);
    res.on("data", (d) => process.stdout.write(d));
  });

  req.on("error", (error) => console.error(error, options.path));
  req.write(data);
  req.end();
};

readdir(directoryPath)
  .then(async (files) => {
    for (const file of files) {
      const filePath = path.join(directoryPath, file);
      const contentType = file.split("_")[0];
      const entity = JSON.parse(await readFile(filePath, "utf8"));
      postEntity(entity, contentType);
    }
  })
  .catch(console.error);
